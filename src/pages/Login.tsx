import React, { FormEvent, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Login = () => {

  const history = useHistory();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const handlerSubmit = (event: FormEvent) => {
    event.preventDefault();


    login(email, password, () => history.push('/chat'));
  }

  return (
    <div>
      <div>
        <form onSubmit={handlerSubmit}>
          <div>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="text"
              value={email}
              onChange={event => setEmail(event.target.value)}
              />
          </div>
          <div>        
            <label htmlFor="password">Senha</label>
            <input 
              type="password" 
              id="password"
              value={password}
              onChange={event => setPassword(event.target.value)}
              />
          </div>
          <button type="submit">Entrar</button>
        </form>
      </div>
    </div>
  )
}

export default Login;