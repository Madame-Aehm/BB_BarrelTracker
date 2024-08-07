import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles/index.css'
import { AuthContextProvider } from './context/AuthContext.tsx'
import AuthWrapper from './components/auth/AuthWrapper.tsx'
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom'
import LabelPage from './pages/LabelPage.tsx'
import Scanner from './pages/Scanner.tsx'
import BarrelUpdate from './pages/BarrelUpdate.tsx'
import Damage from './pages/Damage.tsx'
import History from './pages/History.tsx'
import NavLayout from './components/layout/NavLayout.tsx'
import PlainLayout from './components/layout/PlainLayout.tsx'
import { CustomerContextProvider } from './context/CustomerContext.tsx'
import BarrelPage from './pages/Barrel.tsx'
import ManageBarrels from './pages/ManageBarrels.tsx'
import Error404 from './pages/Error404.tsx'
import ManageCustomers from './pages/ManageCustomers.tsx'
import VersionControl from './VersionControl.tsx'

const router = createBrowserRouter([{
  element: (
    <VersionControl>
      <AuthContextProvider>
        <CustomerContextProvider>
          <AuthWrapper>
            <Outlet />
          </AuthWrapper>
        </CustomerContextProvider>
      </AuthContextProvider>
    </VersionControl>
  ),
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
        {
          path: "/manage-barrels",
          element: <ManageBarrels />
        },
        {
          path: "/manage-customers",
          element: <ManageCustomers />
        }
      ]
    },
    {
      element: <Outlet />,
      children: [
        {
          path: "/barrel",
          element: <BarrelPage />,
          children: [
            {
              path: "update/:brl",
              element: <PlainLayout><BarrelUpdate /></PlainLayout>
            },
            {
              path: "history/:brl",
              element: <PlainLayout top={true}><History /></PlainLayout>
            }
          ]
        },
        {
          path: "/report-damage",
          element: <PlainLayout><Damage /></PlainLayout>
        },
        {
          path: "*",
          element: <PlainLayout><Error404 /></PlainLayout>
        }
      ]
    },
  ]
}])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
