import { Outlet } from "react-router"

function CenteredAuthLayout() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <Outlet />
    </div>
  )
}

export default CenteredAuthLayout