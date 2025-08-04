import './SignUp.css';



function SignUp() {
    return (
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
            </form>
        </div>
);


}

export default SignUp;