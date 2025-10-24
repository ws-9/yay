import { useNavigate } from "react-router"
import { useAuth } from "../store/AuthStore"
import useApi from "../../utilities/hooks/useApi"
import { useEffect, useState } from "react"
import { API_COMMUNITIES_URL } from "../../utilities/urls"
import Community from "../../utilities/Community"

function MainSideBar() {
  const { token, logout } = useAuth()
  const navigate = useNavigate()
  const api = useApi()
  const [communities, setCommunities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api(API_COMMUNITIES_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    })
    .then(data => {
      const communityList = data.map(c => 
        new Community(c.id, c.name, c.ownerId, c.ownerUsername)
      )
      setCommunities(communityList)
    })
    .catch(error => {
      console.error("Failed to fetch communities:", error)
    })
    .finally(() => {
      setLoading(false)
    })
  }, [])

  function handleLogout(event) {
    event.preventDefault()
    logout()
    navigate("/login")
  }

  if (loading) {
    return <div className="bg-gray-100 min-h-full p-4">Loading...</div>
  }

  return (
    <div className="bg-gray-100 min-h-full p-4">
      <h1 className="text-lg font-bold mb-4">All Communities</h1>
      <nav className="flex flex-col gap-2 mb-4">
        {communities.map(community => (
          <div key={community.id} className="hover:underline cursor-pointer">
            {community.name}
          </div>
        ))}
      </nav>
      <button 
        onClick={handleLogout}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
      >
        Logout
      </button>
    </div>
  )
}

export default MainSideBar