import { useState } from "react"
import useApi from "../../utilities/hooks/useApi"
import { useAuth } from "../store/AuthStore"
import { API_COMMUNITIES_URL } from "../../utilities/urls"
import Channel from "../../utilities/Channel"
import { useSetChannelSelection } from "../store/SelectedChannelStore"

export default function SidebarCommunityCollapsible({ community }) {
  const { token } = useAuth()
  const api = useApi()
  const { setSelectedChannel } = useSetChannelSelection()

  const [isExpanded, setIsExpanded] = useState(false)
  const [channels, setChannels] = useState([])
  const [loading, setLoading] = useState(false)
  const [hasFetchedPrior, setHasFetchedPrior] = useState(false)

  function handleExpand() {
    setIsExpanded(!isExpanded)

    if (!hasFetchedPrior && !isExpanded) {
      setLoading(true)
      api(`${API_COMMUNITIES_URL}/${community.id}/channels`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      })
      .then(data => {
        const channelList = data.map(c => new Channel(c.id, c.name, c.communityId))
        setChannels(channelList)
        setHasFetchedPrior(true)
      })
      .catch(error => console.error("Failed to fetch channels:", error))
      .finally(() => setLoading(false))
    }
  }

  function handleChannelSelection(channel) {
    setSelectedChannel(channel)
  }

  return (
    <div>
      <button
        onClick={handleExpand}
        className="w-full text-left px-3 py-2 hover:bg-gray-200 rounded flex items-center gap-2"
      >
        <span className="cursor-pointer">{community.name}</span>
        <span>{isExpanded ? "▼" : "▶"}</span>
      </button>
      {isExpanded && (
        <div className="pl-6">
          {loading ? (
            <p className="text-sm text-gray-500">Loading channels...</p>
          ) : channels.length === 0 ? (
            <p className="text-sm text-gray-500">No channels</p>
          ) : (
            <nav className="flex flex-col gap-1">
              {channels.map(channel => (
                <button
                  key={channel.id}
                  onClick={() => handleChannelSelection(channel)}
                  className="text-sm text-left hover:underline cursor-pointer py-1"
                >
                  # {channel.name}
                </button>
              ))}
            </nav>
          )}
        </div>
      )}
    </div>
  )
}