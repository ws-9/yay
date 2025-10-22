import { createContext, useContext, useState } from "react";

const AuthContext = createContext({
  token: "",
  user: {},
  login: function() {},
  logout: function() {}
})

function AuthProvider({ children }) {
  const [auth, setAuth] = useState({
    token: "",
    user: {},
  })

  function login(token, user) {
    setAuth({ token, user })
  }

  function logout() {
    setAuth({ token: null, user: null })
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