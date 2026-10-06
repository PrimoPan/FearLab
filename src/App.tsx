import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AppShell } from './app/AppShell'
import { PortalSessionProvider } from './lib/portal/PortalSessionContext'

const router = createBrowserRouter([
  { path: '*', element: <PortalSessionProvider><AppShell /></PortalSessionProvider> }
], { future: { v7_relativeSplatPath: true } })

export default function App() {
  return <RouterProvider router={router} future={{ v7_startTransition: true }} />
}
