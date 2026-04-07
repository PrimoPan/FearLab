import { BrowserRouter } from 'react-router-dom'
import { AppShell } from './app/AppShell'

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  )
}
