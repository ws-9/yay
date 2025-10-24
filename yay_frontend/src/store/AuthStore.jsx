import { createContext, useContext, useState } from "react";
import User from "../../utilities/User";

const AuthContext = createContext({
  token: "",
  user: new User(),
  login: function() {},
  logout: function() {}
})

function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const savedToken = localStorage.getItem("token")
    const savedUser = localStorage.getItem("user")

    if (savedToken && savedUser) {
      const userData = JSON.parse(savedUser)
      return {
        token: savedToken,
        user: new User(userData.id, userData.username, userData.roles)
      }
    }

    return {
      token: "",
      user: new User()
    }
  })

  function login(token, user) {
    localStorage.setItem("token", token)
    localStorage.setItem("user", JSON.stringify({
      id: user.id,
      username: user.username,
      roles: user.roles
    }))

    setAuth({ token, user })
  }

  function logout() {
    localStorage.removeItem("token")
    localStorage.removeItem("user")

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