import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

const AuthContext = createContext();

// Make a Supabase user look like the old Base44 user,
// so the rest of the app (which reads user.full_name etc.) keeps working.
const mapUser = (u) => {
  if (!u) return null;
  const meta = u.user_metadata || {};
  return {
    ...u,
    full_name: meta.full_name || meta.name || u.email,
    avatar_url: meta.avatar_url || meta.picture || null,
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [appPublicSettings] = useState(null);

  const applySession = (session) => {
    const u = mapUser(session?.user);
    setUser(u);
    setIsAuthenticated(!!u);
    setIsLoadingAuth(false);
    setAuthChecked(true);
  };

  const checkUserAuth = async () => {
    try {
      setIsLoadingAuth(true);
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      applySession(data.session);
    } catch (error) {
      console.error('User auth check failed:', error);
      setAuthError({ type: 'unknown', message: error.message });
      applySession(null);
    }
  };

  // Kept so App.jsx and other files that call it don't break
  const checkAppState = async () => {};

  useEffect(() => {
    checkUserAuth();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      applySession(session);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const logout = async (shouldRedirect = true) => {
    setUser(null);
    setIsAuthenticated(false);
    await supabase.auth.signOut();
    if (shouldRedirect) {
      window.location.href = '/';
    }
  };

  const navigateToLogin = () => {
    window.location.href =
      '/login?returnTo=' + encodeURIComponent(window.location.pathname);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoadingAuth,
        isLoadingPublicSettings,
        authError,
        appPublicSettings,
        authChecked,
        logout,
        navigateToLogin,
        checkUserAuth,
        checkAppState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
