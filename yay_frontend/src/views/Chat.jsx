import MainSideBar from "../components/MainSideBar"
import ChatAreaBox from "../components/ChatAreaBox"

function Chat() {
  return (
    <div
      className="
        grid lg:grid-cols-[15rem_1fr_15rem] sm:grid-cols-[15rem_1fr] grid-cols-[1fr]
        min-h-screen
      "
    >
      <div className="hidden sm:block">
        <MainSideBar />
      </div>
      <ChatAreaBox />
      <div className="hidden bg-gray-300 lg:block">
        Secondary bar
      </div>
    </div>
  )
}

export default Chat