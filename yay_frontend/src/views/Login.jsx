import { useEffect, useState } from "react";
import { API_LOGIN_URL } from "../../utilities/urls";
import { useAuth } from "../store/AuthStore";
import User from "../../utilities/User";
import { Link, useNavigate } from "react-router";

function Login() {
  const [usernameField, setUsernameField] = useState("");
  const [passwordField, setPasswordField] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate()
  const { token, login } = useAuth()

  useEffect(() => {
    if (token) {
      navigate("/chat")
    }
  }, [])

  function sendLoginRequest(event) {
    event.preventDefault()

    setLoading(true)
    fetch(API_LOGIN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: usernameField,
        password: passwordField
      })
    })
    .then(response => response.json())
    .then(json => {
      login(json.jwtToken, new User(json.id, json.username, json.roles))
      navigate("/chat")
    })
    .finally(() => setLoading(false))
  }

  return (
    <div className="border-2 border-solid">
      <h1>Login Page</h1>
      <form onSubmit={sendLoginRequest} className="flex flex-col">
        <label htmlFor="username">Username</label>
        <input
          id="username"
          value={usernameField}
          onChange={event => setUsernameField(event.target.value)}
          type="text"
          placeholder="Type Username"
          required={true}
        />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          value={passwordField}
          onChange={event => setPasswordField(event.target.value)}
          type="password"
          placeholder="Type Password"
          required={true}
        />
        <button type="submit" className="border-2 border-solid">
          {loading ? "Loading" : "Log in"}
        </button>
        <Link to="/register">Need a new account?</Link>
      </form>
    </div>
  )
}

export default Login