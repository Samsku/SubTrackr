import SignUp from './components/SignUp.jsx'
import SignIn from './components/SignIn.jsx'
import './LandingPage.css'
import './UserPage.css'
import './Authentication.css'
import LandingPage from './components/LandingPage.jsx'
import Userpage from './components/UserPage.jsx'
import {Routes, Route, BrowserRouter} from 'react-router-dom'
import {UserProvider} from './utils/UserContext.jsx'


function App() {
  return (
    <BrowserRouter>
    <UserProvider>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/login" element={<SignUp />} />
      <Route path="/dashboard" element={<Userpage />} />
    </Routes>
    </UserProvider>
    </BrowserRouter>

  )
}

export default App