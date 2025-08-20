import {Link} from 'react-router-dom';
function NavBar() {
    return (
        <nav className="navbar">
            <h1>SubChck</h1>
            <ul>
                <li><a href="#" className="logo">Features</a></li>
                <li><Link to="/login" className="logo">Sign Up</Link></li>
            </ul>
        </nav>
    )
}

export default NavBar;