import { useNavigate } from "react-router"
import { useAuth } from "../../src/store/AuthStore"

function useApi() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  async function requestFromApi(url, options = {}) {
    try {
      const response = await fetch(url, { ...options })

      if (response.status === 401 || response.status === 403) {
        logout()
        navigate('/login')
        throw new Error('Authentication failed')
      }

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }

      const contentType = response.headers.get('content-type')
      if (contentType.includes('application/json')) {
        return await response.json()
      }
      
      return {}
    } catch (error) {
      console.error("API Request failed", error)
      throw error
    }
  }

  return requestFromApi
}

export default useApi