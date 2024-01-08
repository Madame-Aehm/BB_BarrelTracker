import ReactDOM from 'react-dom/client'
// import React from 'react'
import './styles/index.css'
import { AuthContextProvider } from './context/AuthContext.tsx'
import AuthWrapper from './components/auth/AuthWrapper.tsx'
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom'
import LabelPage from './pages/LabelPage.tsx'
import Scanner from './pages/Scanner.tsx'
import BarrelUpdate from './pages/BarrelUpdate.tsx'
import Damage from './pages/Damage.tsx'
import NavLayout from './components/layout/NavLayout.tsx'
import PlainLayout from './components/layout/PlainLayout.tsx'

const router = createBrowserRouter([{
  element: <AuthContextProvider><AuthWrapper><Outlet /></AuthWrapper></AuthContextProvider>,
  children: [
    {
      element: <NavLayout><Outlet /></NavLayout>,
      children: [
        {
          path: "/",
          element: <Scanner />
        },
        {
          path: "/label-gen",
          element: <LabelPage />
        },
      ]
    },
    {
      element: <PlainLayout><Outlet /></PlainLayout>,
      children: [
        {
          path: "/barrel-update/:brl",
          element: <BarrelUpdate />
        },
        {
          path: "/report-damage",
          element: <Damage />
        },
        {
          path: "/history/:id",
          element: <div>History</div>
        }
      ]
    }
  ]
}])

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
    <RouterProvider router={router} />
  // </React.StrictMode>,
)
