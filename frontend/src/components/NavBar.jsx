import {Link, useNavigate} from 'react-router-dom';
import { isAuthenticated, clearAuthData } from '../utils/auth';

function NavBar() {
    const navigate = useNavigate();
    
    const handleLogout = () => {
        clearAuthData();
        navigate('/');
    };

    return (
        <nav className="navbar">
            <h1>SubChck</h1>
            <ul>
                <li><a href="#" className="logo">Features</a></li>
                {isAuthenticated() ? (
                    <li><a onClick={handleLogout} className="logout">Logout</a></li>
                ) : (
                    <li><Link to="/login" className="logo">Sign Up</Link></li>
                )}
            </ul>
        </nav>
    )
}

export default NavBar;