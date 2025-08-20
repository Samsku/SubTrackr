import SignUp from './components/SignUp.jsx'
import SignIn from './components/SignIn.jsx'
import './LandingPage.css'
import  './Userpage.css'
import './Authentication.css'
import LandingPage from './components/LandingPage.jsx'
import Userpage from './components/UserPage.jsx'
import {Routes, Route, BrowserRouter} from 'react-router-dom'


function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/login" element={<SignUp />} />
    </Routes>
    </BrowserRouter>

  )
}

export default App