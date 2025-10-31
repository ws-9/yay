import { useNavigate } from "react-router"
import { useAuth } from "../store/AuthStore"
import useApi from "../../utilities/hooks/useApi"
import { useState } from "react"
import { API_COMMUNITIES_URL } from "../../utilities/urls"
import Community from "../../utilities/Community"
import SidebarCommunityCollapsible from "./SidebarCommunityCollapsible"
import { useCommunity } from "../store/CommunityStore"

function MainSideBar() {
  const { token, logout } = useAuth()
  const navigate = useNavigate()
  const api = useApi()

  const [activeTab, setActiveTab] = useState("my-communities")

  const  {
    myCommunities,
    myCommunitiesLoading,
  } = useCommunity()

  const [searchCommunities, setSearchCommunities] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)

  function handleFetchAllCommunities(event) {
    event.preventDefault()

    setSearchLoading(true)
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
      setSearchCommunities(communityList)
    })
    .catch(error => {
      console.error("Failed to search communities:", error)
    })
    .finally(() => {
      setSearchLoading(false)
    })
  }

  function handleLogout(event) {
    event.preventDefault()
    logout()
    navigate("/login")
  }

  return (
    <div className="bg-gray-100 min-h-full p-4">
      <div className="flex gap-2 mb-4 border-b">
        <button
          onClick={() => setActiveTab("my-communities")}
          className={`px-4 py-2 cursor-pointer ${
            activeTab === "my-communities"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-600"
          }`}
          >
          My Communities
        </button>
        <button
          onClick={(e) => {
            setActiveTab("search")
            handleFetchAllCommunities(e)
          }}
          className={`px-4 py-2 cursor-pointer ${
            activeTab === "search"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-600"
          }`}
        >
          Search
        </button>
      </div>

      {activeTab === "my-communities" && (
        <div>
          {myCommunitiesLoading ? (
            <p>Loading...</p>
          ) : myCommunities.length === 0 ? (
            <p>No communities yet.</p>
          ) : (
            <nav className="flex flex-col gap-2">
              {myCommunities.map(community => (
                <SidebarCommunityCollapsible
                    key={community.id}
                    community={community}
                />
              ))}
            </nav>
          )}
        </div>
      )}

      {activeTab === "search" && (
        <div>
          {searchLoading ? (
            <p>Loading...</p>
          ) : searchCommunities.length === 0 ? (
            <p>No communities found.</p>
          ) : (
            <nav className="flex flex-col gap-2">
              {searchCommunities.map(community => (
                <div key={community.id} className="hover:underline cursor-pointer">
                  {community.name}
                </div>
              ))}
            </nav>
          )}
        </div>
      )}
 
      <button 
        onClick={handleLogout}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:underline cursor-pointer"
      >
        Logout
      </button>
    </div>
  )
}

export default MainSideBar