import '../Authentication.css';
import {Link} from 'react-router-dom';



function SignUp() {
    return (
        <div className = "authentication-page">
        <div className="signup-container">
            <form>
            <h1>Sign Up</h1>
            <input type="text" placeholder="Name" required />
            <input type="email" placeholder="Email" required />
            <input type="password" placeholder="Password" required />

            <div className="checkbox-wrapper">
                <input type="checkbox" id="terms" required />
                <label htmlFor="terms">I agree to the terms and conditions</label>
            </div>

            <button type="submit">Sign Up</button>
            <div className = "Link-to">
                <Link to ="/signin">Already have an account? Sign In</Link>
            </div>
            </form>
        </div>
        </div>
);


}

export default SignUp;