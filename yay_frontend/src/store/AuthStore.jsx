import { createContext, useContext, useState } from "react";
import User from "../../utilities/User";

const AuthContext = createContext({
  token: "",
  user: {},
  login: function() {},
  logout: function() {}
})

function AuthProvider({ children }) {
  const [auth, setAuth] = useState({
    token: "",
    user: new User()
  })

  function login(token, user) {
    setAuth({ token, user })
  }

  function logout() {
    setAuth({ token: "", user: new User() })
  }

  return (
    <AuthContext value={{ ...auth, login, logout }}>
      {children}
    </AuthContext>
  )
}

function useAuth() {
  return useContext(AuthContext)
}

export {
  AuthProvider,
  useAuth,
}