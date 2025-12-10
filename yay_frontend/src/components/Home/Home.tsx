import { Link } from 'react-router';

export default function Home() {
  return (
    <div className="flex flex-col">
      <h1>Home Page</h1>
      <Link to="login">Login</Link>
      <Link to="register">Register</Link>
    </div>
  );
}
