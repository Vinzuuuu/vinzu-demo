// Central category configuration for Vinzu marketplace.
// Each category defines subcategories and category-specific filters.

export const CATEGORIES = [
  {
    id: "vehicles",
    name: "Vehicles",
    icon: "Car",
    subcategories: ["Cars", "Motorcycles", "Trucks", "Boats", "Auto Parts"],
    keywords: ["car", "bmw", "audi", "toyota", "honda", "ford", "mercedes", "vw", "nissan", "hyundai", "kia", "motorcycle", "bike", "truck", "boat", "van"],
    filters: [
      { key: "brand", label: "Brand", type: "text" },
      { key: "model", label: "Model", type: "text" },
      { key: "year_min", label: "Year from", type: "number" },
      { key: "mileage_max", label: "Max mileage (km)", type: "number" },
      { key: "fuel", label: "Fuel type", type: "select", options: ["Any", "Petrol", "Diesel", "Hybrid", "Electric", "LPG"] },
      { key: "price_min", label: "Min price", type: "number" },
      { key: "price_max", label: "Max price", type: "number" }
    ]
  },
  {
    id: "real-estate",
    name: "Real Estate",
    icon: "Home",
    subcategories: ["Apartments for Sale", "Apartments for Rent", "Houses", "Land", "Commercial"],
    keywords: ["apartment", "flat", "house", "villa", "studio", "rent", "lease", "property", "land", "plot", "office", "commercial"],
    filters: [
      { key: "property_type", label: "Property type", type: "select", options: ["Any", "Apartment", "House", "Studio", "Land", "Office"] },
      { key: "bedrooms", label: "Bedrooms", type: "select", options: ["Any", "1", "2", "3", "4", "5+"] },
      { key: "price_min", label: "Min price", type: "number" },
      { key: "price_max", label: "Max price", type: "number" },
      { key: "sqm_min", label: "Min sqm", type: "number" },
      { key: "location", label: "Location", type: "text" }
    ]
  },
  {
    id: "fashion",
    name: "Fashion & Clothing",
    icon: "Shirt",
    subcategories: ["Women's", "Men's", "Kids", "Shoes", "Accessories", "Bags"],
    keywords: ["dress", "shirt", "jeans", "jacket", "coat", "shoes", "sneakers", "nike", "adidas", "zara", "handbag", "purse", "fashion", "clothing", "skirt"],
    filters: [
      { key: "size", label: "Size", type: "select", options: ["Any", "XS", "S", "M", "L", "XL", "XXL", "One Size"] },
      { key: "brand", label: "Brand", type: "text" },
      { key: "condition", label: "Condition", type: "select", options: ["Any", "new", "used"] },
      { key: "color", label: "Color", type: "text" },
      { key: "price_min", label: "Min price", type: "number" },
      { key: "price_max", label: "Max price", type: "number" }
    ]
  },
  {
    id: "electronics",
    name: "Electronics",
    icon: "Smartphone",
    subcategories: ["Phones", "Laptops", "TVs", "Gaming", "Audio"],
    keywords: ["iphone", "samsung", "phone", "laptop", "macbook", "tv", "playstation", "xbox", "headphones", "speaker", "tablet", "ipad", "camera", "console"],
    filters: [
      { key: "type", label: "Type", type: "select", options: ["Any", "Phone", "Laptop", "TV", "Gaming", "Audio", "Camera"] },
      { key: "brand", label: "Brand", type: "text" },
      { key: "condition", label: "Condition", type: "select", options: ["Any", "new", "used"] },
      { key: "price_min", label: "Min price", type: "number" },
      { key: "price_max", label: "Max price", type: "number" }
    ]
  },
  {
    id: "home-garden",
    name: "Home & Garden",
    icon: "Sofa",
    subcategories: ["Furniture", "Appliances", "Tools", "Decor"],
    keywords: ["sofa", "table", "chair", "bed", "fridge", "washer", "drill", "lamp", "decor", "garden", "couch", "wardrobe"],
    filters: [
      { key: "type", label: "Type", type: "select", options: ["Any", "Furniture", "Appliance", "Tool", "Decor"] },
      { key: "condition", label: "Condition", type: "select", options: ["Any", "new", "used"] },
      { key: "price_min", label: "Min price", type: "number" },
      { key: "price_max", label: "Max price", type: "number" }
    ]
  },
  {
    id: "jobs",
    name: "Jobs",
    icon: "Briefcase",
    subcategories: ["Full-time", "Part-time", "Contract", "Internship"],
    keywords: ["job", "hiring", "career", "developer", "designer", "manager", "sales", "marketing", "remote work", "vacancy"],
    filters: [
      { key: "job_type", label: "Job type", type: "select", options: ["Any", "Full-time", "Part-time", "Contract", "Internship"] },
      { key: "salary_min", label: "Min salary", type: "number" },
      { key: "salary_max", label: "Max salary", type: "number" },
      { key: "remote", label: "Work mode", type: "select", options: ["Any", "Remote", "On-site", "Hybrid"] },
      { key: "location", label: "Location", type: "text" }
    ]
  },
  {
    id: "services",
    name: "Services",
    icon: "Wrench",
    subcategories: ["Design", "Writing", "Repairs", "Cleaning", "Tutoring"],
    keywords: ["service", "freelance", "design", "logo", "writing", "repair", "plumber", "cleaning", "tutor", "lesson", "gig"],
    filters: [
      { key: "delivery_time", label: "Delivery time", type: "select", options: ["Any", "1 day", "3 days", "1 week", "2 weeks+"] },
      { key: "price_min", label: "Min price", type: "number" },
      { key: "price_max", label: "Max price", type: "number" },
      { key: "seller_rating", label: "Seller rating", type: "select", options: ["Any", "4+", "4.5+"] }
    ]
  },
  {
    id: "business",
    name: "Business for Sale",
    icon: "Store",
    subcategories: ["Cafe", "Retail", "Franchise", "Online Business", "Manufacturing"],
    keywords: ["business", "franchise", "shop for sale", "cafe for sale", "restaurant", "company"],
    filters: [
      { key: "type", label: "Business type", type: "select", options: ["Any", "Cafe", "Retail", "Franchise", "Online", "Manufacturing"] },
      { key: "price_min", label: "Min price", type: "number" },
      { key: "price_max", label: "Max price", type: "number" },
      { key: "location", label: "Location", type: "text" }
    ]
  },
  {
    id: "pets",
    name: "Pets",
    icon: "PawPrint",
    subcategories: ["Dogs", "Cats", "Birds", "Fish", "Pet Supplies"],
    keywords: ["dog", "puppy", "cat", "kitten", "bird", "fish", "aquarium", "pet", "adoption"],
    filters: [
      { key: "type", label: "Pet type", type: "select", options: ["Any", "Dog", "Cat", "Bird", "Fish", "Other"] },
      { key: "price_min", label: "Min price", type: "number" },
      { key: "price_max", label: "Max price", type: "number" },
      { key: "location", label: "Location", type: "text" }
    ]
  },
  {
    id: "other",
    name: "Other",
    icon: "Package",
    subcategories: ["Miscellaneous"],
    keywords: [],
    filters: [
      { key: "price_min", label: "Min price", type: "number" },
      { key: "price_max", label: "Max price", type: "number" },
      { key: "location", label: "Location", type: "text" }
    ]
  }
];

export const CATEGORY_COLORS = {
  vehicles: "#e63946",
  "real-estate": "#2a9d8f",
  fashion: "#9b5de5",
  electronics: "#2a6fdb",
  "home-garden": "#43aa8b",
  jobs: "#b08940",
  services: "#f4801a",
  business: "#5a67d8",
  pets: "#ef6f92",
  other: "#7a8290",
};

export const getCategory = (id) => CATEGORIES.find((c) => c.id === id);

// Detect the most likely category from a free-text search query.
export const detectCategory = (query) => {
  if (!query) return null;
  const q = query.toLowerCase();
  for (const cat of CATEGORIES) {
    for (const kw of cat.keywords) {
      if (q.includes(kw)) return cat.id;
    }
  }
  return null;
};
