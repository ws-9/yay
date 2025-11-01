import { useGetChannelSelection } from "../store/SelectedChannelStore"

function ChatAreaBox() {
  const { selectedChannel } = useGetChannelSelection()

  return (
    <div>
      <h1>Chat Page</h1>
      {selectedChannel &&

        <h2>Selected channel: {selectedChannel.name}</h2>
      }
    </div>
  )
}

export default ChatAreaBox