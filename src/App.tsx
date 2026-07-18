import { BrowserRouter } from 'react-router-dom'
import { AppShell } from './app/AppShell'

export default function App() {
  return (
    <BrowserRouter
      future={{
        v7_relativeSplatPath: true,
        v7_startTransition: true
      }}
    >
      <AppShell />
    </BrowserRouter>
  )
}
