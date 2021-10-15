import React, { createContext, ReactNode, useEffect, useState } from 'react';
import jwt_decode from "jwt-decode";
import api from '../services/api';

type UserType = {
  id: string;
  nome: string;
  email: string;
}

type DecodedType = {
  sub: string;
  email: string;
  nome: string;
}

type TokenType = {
  token: string;
}

type AuthContextType = {
  user: UserType | undefined;
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  login(email: string, senha: string, callback: Function): Promise<void>;
  logout(): void;
}

type AuthContextProviderProps = {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider(props: AuthContextProviderProps) {

  const [user, setUser] = useState<UserType>();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(true);

  useEffect(() => {
    function onLoad() {
      const token = localStorage.getItem('token');
      if (token) {
        const decoded = jwt_decode(token) as DecodedType;
        setUser({
          id: decoded.sub,
          email: decoded.email,
          nome: decoded.nome,
        });
        setIsAuthenticated(true);
      }
      setIsAuthenticating(false);
    };
    onLoad();
  }, [isAuthenticated]);

  const login = async (email: string, senha: string, callback: Function) => {
    setIsAuthenticating(true);
    const response = await api.post('/auth', {
      email: email,
      password: senha
    })
    const { token } = response.data as TokenType;
    localStorage.setItem('token', token)
    const decoded = jwt_decode(token) as DecodedType;
    setUser({
      id: decoded.sub,
      email: decoded.email,
      nome: decoded.nome,
    })
    setIsAuthenticated(true);
    setIsAuthenticating(false);
    callback();
  }

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    window.location.reload();
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isAuthenticating, login, logout }}>
      {props.children}
    </AuthContext.Provider>
  );
}