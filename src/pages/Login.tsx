import React, { FormEvent, useState } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

import "../styles/login.scss";

const Login = () => {
  const history = useHistory();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handlerSubmit = async (event: FormEvent) => {
    event.preventDefault();

    await login(email, password, () => history.push("/chat"));
  };

  return (
    <div className="page-login-overlay">
      <div className="page-login">
        <h1>Login</h1>
        <form onSubmit={handlerSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="text"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <button className="button" type="submit">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
