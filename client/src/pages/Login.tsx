import React, { useState } from 'react';
import { useLoginMutation } from '../redux/api/authApi';

function Login() {
  const [username, setUsername] = useState("daryledevs");
  const [password, setPassword] = useState("password123");
  const [login] = useLoginMutation({ fixedCacheKey: "shared-update-post" }); 

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    login({ username, password });
  }

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