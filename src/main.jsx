import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from "react-router-dom";
import './index.css'
import { router } from './Routes/AllRoutes';
import AuthProvider from './Context/AuthProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient()

createRoot(document.getElementById("root")).render(
 <QueryClientProvider client={queryClient}>
  <AuthProvider><RouterProvider router={router} /></AuthProvider>
 </QueryClientProvider>

  );
