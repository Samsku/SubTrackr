import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import LandingPage from './components/LandingPage.jsx'
import UserPage from './components/UserPage.jsx'
// remember to change it to landingpage or whatever.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserPage/>
  </StrictMode>,
)
