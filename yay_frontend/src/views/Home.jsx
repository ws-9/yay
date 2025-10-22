import { Link } from "react-router"

function Home() {
  return (
    <>
      <h1>Home Page</h1>
      <div>
        <Link to="login">Login</Link>
      </div>
      <div>
        <Link to="register">Register</Link>
      </div>
    </>
  )
}

export default Home