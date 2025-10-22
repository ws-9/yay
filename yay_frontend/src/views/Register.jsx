import { useState } from "react";
import { API_REGISTER_URL } from "../../utilities/urls";

function Register() {
  const [usernameField, setUsernameField] = useState("");
  const [passwordField, setPasswordField] = useState("");
  const [loading, setLoading] = useState(false);

  function sendRegisterRequest(event) {
    event.preventDefault()

    setLoading(true)
    fetch(API_REGISTER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: usernameField,
        password: passwordField
      })
    })
    .then(response => {
      switch (response.status) {
        case 401:
          return response.json()
        case 400:
          return response.json()
        default:
          return response.status
      }
    })
    .then(status => console.log(status))
    .catch(response => {
      console.error(response)
    })
    .finally(() => setLoading(false))
  }

  return <>
    <h1>Register Page</h1>
    <form onSubmit={sendRegisterRequest}>
      <div>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          value={usernameField}
          onChange={event => setUsernameField(event.target.value)}
          type="text"
          placeholder="Type Username"
          required={true}
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          value={passwordField}
          onChange={event => setPasswordField(event.target.value)}
          type="password"
          placeholder="Type Password"
          required={true}
        />
      </div>
      <button type="submit">
        {loading ? "Loading" : "Sign up"}
      </button>
    </form>
  </>
}

export default Register