import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router';
import HomePage from './components/HomePage';
import AuthPage from './components/AuthPage';
import Register from './components/AuthPage/Register';
import Login from './components/AuthPage/Login';
import { ChatPage } from './components/chat';
import AppDataProvider from './components/providers/AppDataProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toast } from '@base-ui/react/toast';

const queryClient = new QueryClient();
const toastManager = Toast.createToastManager();

const router = createBrowserRouter([
  {
    path: '/',
    Component: HomePage,
  },
  {
    Component: AuthPage,
    children: [
      { path: 'register', Component: Register },
      { path: 'login', Component: Login },
    ],
  },
  {
    path: 'chat',
    Component: AppDataProvider,
    children: [
      {
        index: true,
        Component: ChatPage,
      },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Toast.Provider toastManager={toastManager}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </Toast.Provider>
  </StrictMode>,
);
