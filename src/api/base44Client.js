import { supabase } from "@/lib/supabaseClient";

const BUCKET = "listing-images";

const ENTITIES = {
  Listing: {
    table: "listings",
    cols: ["title", "description", "price", "category", "subcategory", "condition",
      "location", "images", "seller_name", "status", "negotiable", "attributes"],
  },
  Conversation: {
    table: "conversations",
    cols: ["listing_id", "participant_ids", "last_message_date"],
  },
  Message: {
    table: "messages",
    cols: ["conversation_id", "sender_id", "content"],
  },
  Review: {
    table: "reviews",
    cols: ["reviewee_id", "reviewer_id", "rating", "comment"],
  },
  User: {
    table: "profiles",
    cols: ["full_name", "phone", "avatar_url"],
  },
};

const FIELD_MAP = {
  created_by_id: "created_by",
  created_date: "created_at",
  updated_date: "updated_at",
};
const mapKey = (k) => FIELD_MAP[k] || k;

const fromRow = (row) =>
  row && {
    ...row,
    created_date: row.created_at,
    updated_date: row.updated_at,
    created_by_id: row.created_by,
  };

const pick = (obj, cols) =>
  Object.fromEntries(Object.entries(obj || {}).filter(([k]) => cols.includes(k)));

async function currentUser() {
  const { data } = await supabase.auth.getUser();
  return data?.user || null;
}

function makeEntity(name) {
  const { table, cols } = ENTITIES[name];

  const entity = {
    async filter(query = {}, sort, limit) {
      let q = supabase.from(table).select("*");
      for (const [k, v] of Object.entries(query)) q = q.eq(mapKey(k), v);
      if (sort) {
        const desc = sort.startsWith("-");
        q = q.order(mapKey(sort.replace(/^-/, "")), { ascending: !desc });
      }
      if (limit) q = q.limit(limit);
      const { data, error } = await q;
      if (error) throw error;
      return (data || []).map(fromRow);
    },

    async list(sort, limit) {
      return entity.filter({}, sort, limit);
    },

    async get(id) {
      const q = supabase.from(table).select("*").eq("id", id);
      const { data, error } = name === "User" ? await q.maybeSingle() : await q.single();
      if (error) throw error;
      return fromRow(data);
    },

    async create(payload) {
      const user = await currentUser();
      if (!user) throw new Error("You must be logged in");
      const row = pick(payload, cols);
      if (name === "Listing") {
        row.created_by = user.id;
        row.seller_name = row.seller_name || user.user_metadata?.full_name || user.user_metadata?.name || null;
      }
      if (name === "Message") row.sender_id = user.id;
      if (name === "Review") row.reviewer_id = user.id;
      if (name === "Conversation") {
        const ids = row.participant_ids || [];
        row.participant_ids = ids.includes(user.id) ? ids : [...ids, user.id];
      }
      const { data, error } = await supabase.from(table).insert(row).select().single();
      if (error) throw error;
      return fromRow(data);
    },

    async update(id, patch) {
      const row = pick(patch, cols);
      if (name === "Listing") row.updated_at = new Date().toISOString();
      const { data, error } = await supabase.from(table).update(row).eq("id", id).select().single();
      if (error) throw error;
      return fromRow(data);
    },

    async delete(id) {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
      return true;
    },
  };
  return entity;
}

const entities = Object.fromEntries(Object.keys(ENTITIES).map((n) => [n, makeEntity(n)]));

export const base44 = {
  entities,

  auth: {
    async me() {
      const user = await currentUser();
      if (!user) throw new Error("Not authenticated");
      const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      return {
        ...(profile || {}),
        id: user.id,
        email: user.email,
        full_name: profile?.full_name || user.user_metadata?.full_name || user.user_metadata?.name || "",
      };
    },

    async updateMe(patch) {
      const user = await currentUser();
      if (!user) throw new Error("Not authenticated");
      const row = { id: user.id, ...pick(patch, ENTITIES.User.cols) };
      const { error } = await supabase.from("profiles").upsert(row);
      if (error) throw error;
      return base44.auth.me();
    },

    async isAuthenticated() {
      const { data } = await supabase.auth.getSession();
      return !!data?.session;
    },

    async logout(redirectUrl) {
      await supabase.auth.signOut();
      if (redirectUrl) window.location.href = redirectUrl;
    },
  },

  integrations: {
    Core: {
      async UploadPublicFile({ file }) {
        const user = await currentUser();
        if (!user) throw new Error("You must be logged in to upload");
        const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
        const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
        const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
          contentType: file.type,
        });
        if (error) throw error;
        const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
        return { file_url: data.publicUrl };
      },
    },
  },
};

export default base44;
