import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router'
import './index.css'
import App from './App.jsx'
import Home from './views/Home.jsx'
import Register from './views/Register.jsx'
import Login from './views/Login.jsx'
import { AuthProvider } from './store/AuthStore.jsx'
import Chat from './views/Chat.jsx'
import CenteredAuthLayout from './components/CenteredAuthLayout.jsx'
import WideChatLayout from './components/WideChatLayout.jsx'
import MainSideBar from './components/MainSideBar.jsx'
import { CommunityProvider } from './store/CommunityStore.jsx'
import { ChannelSelectionProvider } from './store/SelectedChannelStore.jsx'

const router = createBrowserRouter([
  {
    Component: App,
    children: [
      {
        path: '/',
        Component: Home,
      },
      {
        Component: CenteredAuthLayout,
        children: [
          {
            path: 'register',
            Component: Register,
          },
          {
            path: 'login',
            Component: Login
          }, 
        ]
      },
      {
        element: (
          <CommunityProvider>
            <ChannelSelectionProvider>
              <WideChatLayout primarySidebar={<MainSideBar />} />
            </ChannelSelectionProvider>
          </CommunityProvider>
        ),
        children: [
          {
            path: 'chat',
            Component: Chat
          },
        ]
      }
    ]
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
