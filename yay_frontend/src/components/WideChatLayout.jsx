import { Outlet } from "react-router"

function WideChatLayout({ primarySidebar, secondarySidebar }) {
  return (
    <div
      className="
        grid lg:grid-cols-[15rem_1fr_15rem] sm:grid-cols-[15rem_1fr] grid-cols-[1fr]
        min-h-screen
      "
    >
      <div className="hidden sm:block">
        {primarySidebar}
      </div>
      <Outlet />
      <div className="hidden bg-gray-300 lg:block">
        Secondary bar
      </div>
    </div>
  )
}

export default WideChatLayout