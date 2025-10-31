import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthStore";
import useApi from "../../utilities/hooks/useApi";
import { API_MY_COMMUNITIES_URL } from "../../utilities/urls";
import Community from "../../utilities/Community";

const CommunityContext = createContext({
  myCommunities: [],
  loading: true,
  selectedCommunity: null,
  fetchMyCommunities: function() {},
  setSelectedCommunity: function() {},
})

export function CommunityProvider({ children }) {
  const { token } = useAuth()
  const api = useApi()

  const [myCommunities, setMyCommunities] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCommunity, setSelectedCommunity] = useState(null)

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }

    fetchMyCommunities()
  }, [])

  function fetchMyCommunities() {
    setLoading(true)
    api(API_MY_COMMUNITIES_URL, {
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
      setMyCommunities(communityList)
    })
    .catch(error => {
      console.error("Failed to fetch my communities:", error)
    })
    .finally(() => setLoading(false))
  }
  return (
    <CommunityContext
      value={{
        myCommunities,
        loading,
        selectedCommunity,
        fetchMyCommunities,
        setSelectedCommunity
      }}
    >
      {children}
    </CommunityContext>
  )
}

export function useCommunity() {
  return useContext(CommunityContext)
}