import {Link, useNavigate} from 'react-router-dom';
import { isAuthenticated, clearAuthData, getUser } from '../utils/auth';
import { useUser } from '../utils/UserContext';

function NavBar() {
    const navigate = useNavigate();
    const { user, setUser } = useUser();
    
    const handleLogout = () => {
        clearAuthData();
        setUser(null);
        navigate('/');
    };

    return (
        <nav className="navbar">
            <h1>SubChck</h1>
            <ul>
                <li><a href="#" className="logo">Features</a></li>
                {isAuthenticated() && user? (
                    <a onClick={handleLogout} className="logo">{user.name}</a>
                ) : (
                    <li><Link to="/login" className="logo">Sign Up</Link></li>
                )}
            </ul>
        </nav>
    )
}

export default NavBar;