import React, { useState } from 'react';
import { login } from '../redux/action/auth';
import { useAppDispatch } from '../redux/hooks/hooks';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();

  async function handleSubmit(event: React.FormEvent){
    event.preventDefault();
    dispatch(login({ username, password }));
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Username or Email"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;