import '../Authentication.css';
import {Link} from 'react-router-dom';


function SignIn() {
    return (
        <div className = "authentication-page">
        <div className="signup-container">
            <form>
                <h1>Sign In</h1>
                <input type="email" placeholder="Email" required />
                <input type="password" placeholder="Password" required />
                
                <button type="submit">Sign In</button>
                <div className = "Link-to">
                <Link to ="/login">Don't have an account? Sign Up</Link>
            </div>
            </form>
        </div>
        </div>
    );


}

export default SignIn;