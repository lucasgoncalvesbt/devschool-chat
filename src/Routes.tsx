import React from 'react';
import { Redirect, Route, Switch } from "react-router-dom";
import { useAuth } from './hooks/useAuth';
import Chat from './pages/Chat';
import Login from './pages/Login';

export default function Routes() {
  const { isAuthenticated } = useAuth();

  return (
    <Switch>
      <Route path="/chat">
        {!isAuthenticated ? <Redirect to="/login"/> : <Chat />}
      </Route>
      <Route exact path="/login">
        {isAuthenticated ? <Redirect to="/chat"/> : <Login />}
      </Route>
      
    </Switch>
  )

}