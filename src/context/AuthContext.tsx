import { loginUser, registerUser } from '../services/api';
import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { AuthUser } from '../types';
import { socket } from '../services/socket';


interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
}


const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const SESSION_KEY = 'chat-dashboard:mock-session';

// Phase 1 stand-in for the real flow described in the project plan:
// register/login -> Node.js checks email+password -> bcrypt/JWT -> React
// stores auth state. Here we simulate it with localStorage so the pages
// and routing behave correctly before the backend exists.



export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const raw = localStorage.getItem(SESSION_KEY);

  if (raw) {
    setUser(JSON.parse(raw));
  }

  setLoading(false);
}, []);

  useEffect(() => {
  if (user?.token) {
    socket.auth = {
      token: user.token,
    };

    socket.connect();
  } else {
    socket.disconnect();
  }

  return () => {
    socket.disconnect();
  };
}, [user]);


  const login: AuthContextValue['login'] = async (email, password) => {
  try {
    const data = await loginUser(email, password);

    const authUser: AuthUser = {
      id: data.user.id,
      name: data.user.name,
      email: data.user.email,
      token: data.token,
    };

    setUser(authUser);
    localStorage.setItem(SESSION_KEY, JSON.stringify(authUser));

    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Login failed',
    };
  }
};

  const register: AuthContextValue['register'] = async (name, email, password) => {
  try {
    await registerUser(name, email, password);
await login(email, password);

return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Registration failed',
    };
  }
};
    

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
