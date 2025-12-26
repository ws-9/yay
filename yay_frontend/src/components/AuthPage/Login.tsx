import { useEffect, useState } from 'react';
import { useIsAuthenticated } from '../../store/authStore';
import { useLogin } from '../../hooks/useLoginMutation';
import { Link, useNavigate } from 'react-router';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, isPending, error } = useLogin();
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/chat');
    }
  }, [isAuthenticated]);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    login({ username, password });
  }

  return (
    <div className="border-2 border-solid">
      <h1>Login Page</h1>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <label htmlFor="username">Username</label>
        <input
          id="username"
          value={username}
          onChange={event => setUsername(event.target.value)}
          type="text"
          placeholder="Type Username"
          required={true}
        />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          value={password}
          onChange={event => setPassword(event.target.value)}
          type="password"
          placeholder="Type Password"
          required={true}
        />
        <button type="submit" className="border-2 border-solid">
          {isPending ? 'Loading' : 'Log in'}
        </button>
        <Link to="/register">Need a new account?</Link>
        {error && <p>{error.message}</p>}
      </form>
    </div>
  );
}
