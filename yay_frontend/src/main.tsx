import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router';
import Home from './components/Home';
import AuthLayout from './components/AuthLayout';
import Register from './components/AuthLayout/Register';
import Login from './components/AuthLayout/Login';
import Chat from './components/Chat';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    Component: Home,
  },
  {
    Component: AuthLayout,
    children: [
      { path: 'register', Component: Register },
      { path: 'login', Component: Login },
    ],
  },
  {
    path: 'chat',
    Component: Chat,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
);
