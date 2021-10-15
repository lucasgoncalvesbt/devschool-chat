import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import './App.scss';
import { AuthContextProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import Routes from './Routes';

function App() {
  const { isAuthenticating } = useAuth();

  return (
    <BrowserRouter>
    {!isAuthenticating && (
      <AuthContextProvider>
        <Routes />
      </AuthContextProvider>
    )}
    </BrowserRouter>
  );
}

export default App;
