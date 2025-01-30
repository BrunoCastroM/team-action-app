import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  registerUser: (name: string, email: string, password: string, role?: string, clubId?: string | null) => Promise<boolean>;  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Estado de carregamento

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      api.defaults.headers.Authorization = `Bearer ${savedToken}`;
    }

    setLoading(false);
  }, []);

  // Faz login
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const resp = await api.post('/users/login', { email, password });
      const { user, token } = resp.data;

      setUser(user);
      setToken(token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      api.defaults.headers.Authorization = `Bearer ${token}`;

      toast.success(`Bem-vindo, ${user.name}!`);
      return true;
    } catch (err: any) {
      toast.error(`Erro ao fazer login: ${err.response?.data?.error || err.message}`);
      return false;
    }
  };

  // Faz logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    delete api.defaults.headers.Authorization;
    toast.info('Desconectado com sucesso.');
  };

  // Registra novo usuário
  const registerUser = async (
    name: string,
    email: string,
    password: string,
    role = 'user',
    clubId?: string | null
  ): Promise<boolean> => {
    try {
      await api.post('/users/register', { name, email, password, role, clubId });
      return true;
    } catch (err: any) {
      toast.error(`Erro no registro: ${err.response?.data?.error || err.message}`);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        registerUser,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
