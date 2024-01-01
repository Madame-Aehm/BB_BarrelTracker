import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles/index.css'
import { AuthContextProvider } from './context/AuthContext.tsx'
import AuthWrapper from './components/auth/AuthWrapper.tsx'
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom'
import LabelPage from './pages/LabelPage.tsx'
import Homepage from './pages/Homepage.tsx'

const router = createBrowserRouter([{
  element: <AuthContextProvider><AuthWrapper><Outlet /></AuthWrapper></AuthContextProvider>,
  children: [
    {
      path: "/",
      element: <Homepage />
    },
    {
      path: "label-gen",
      element: <LabelPage />
    }
  ]
}])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
