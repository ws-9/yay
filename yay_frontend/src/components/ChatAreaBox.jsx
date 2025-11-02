import { useState, useEffect, useRef } from "react"
import { useAuth } from "../store/AuthStore"
import { useGetChannelSelection } from "../store/SelectedChannelStore"
import { Client } from "@stomp/stompjs"

export default function ChatAreaBox() {
  const { token, user } = useAuth()
  const { selectedChannel } = useGetChannelSelection()
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState("")
  const [targetUser, setTargetUser] = useState("")
  const clientRef = useRef(null)
  const [connected, setConnected] = useState(false)

  // Initialize WebSocket connection
  useEffect(() => {
    if (!token || !user.username) return

    const client = new Client({
      brokerURL: "ws://localhost:8080/ws",
      connectHeaders: {
        "Authorization": `Bearer ${token}`
      },
      onConnect: () => {
        console.log("Connected to WebSocket")
        setConnected(true)

        // Subscribe to user-specific topic
        client.subscribe(`/user/topic`, (message) => {
          const payload = JSON.parse(message.body)
          setMessages(prev => [...prev, {
            from: payload.from,
            message: payload.message,
            timestamp: new Date().toLocaleTimeString()
          }])
        })
      },
      onDisconnect: () => {
        console.log("Disconnected from WebSocket")
        setConnected(false)
      },
      onStompError: (frame) => {
        console.error("STOMP error:", frame)
      }
    })

    client.activate()
    clientRef.current = client

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate()
      }
    }
  }, [token, user.username])

  const sendMessage = (e) => {
    e.preventDefault()
    if (!inputMessage.trim() || !targetUser.trim() || !clientRef.current?.connected) {
      alert("Enter a target user and message, and wait for connection")
      return
    }

    clientRef.current.publish({
      destination: "/app/chat",
      body: JSON.stringify({
        to: targetUser,
        message: inputMessage,
        from: user.username
      })
    })

    // Add sent message to local state
    setMessages(prev => [...prev, {
      from: user.username,
      message: inputMessage,
      timestamp: new Date().toLocaleTimeString(),
      isSent: true
    }])

    setInputMessage("")
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Direct Messages</h1>
      <p className="text-sm mb-2">
        Connected as: <strong>{user.username}</strong> 
        <span className={`ml-2 px-2 py-1 rounded text-xs ${connected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {connected ? "🟢 Online" : "🔴 Offline"}
        </span>
      </p>

      {selectedChannel && (
        <p className="text-sm text-gray-600 mb-4">Channel: {selectedChannel.name}</p>
      )}

      {/* Messages display */}
      <div className="border rounded-lg p-4 h-80 overflow-y-auto bg-gray-50 mb-4">
        {messages.length === 0 ? (
          <p className="text-gray-400 text-center mt-10">No messages yet</p>
        ) : (
          <div className="space-y-2">
            {messages.map((msg, idx) => (
              <div key={idx} className={`p-2 rounded text-sm ${msg.isSent ? 'bg-blue-100 text-right' : 'bg-white'}`}>
                <p className="font-semibold text-xs text-gray-600">{msg.from}</p>
                <p>{msg.message}</p>
                <p className="text-xs text-gray-500 mt-1">{msg.timestamp}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Send form */}
      <form onSubmit={sendMessage} className="space-y-3">
        <input
          type="text"
          placeholder="Target username (who to send to)"
          value={targetUser}
          onChange={(e) => setTargetUser(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={!connected}
            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />
          <button
            type="submit"
            disabled={!connected}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  )
}