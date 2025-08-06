import './SignUp.css';



function SignIn() {
    return (
        <div className="signup-container">
            <form>
                <h1>Sign In</h1>
                <input type="email" placeholder="Email" required />
                <input type="password" placeholder="Password" required />
                <button type="submit">Sign In</button>
            </form>
        </div>
);


}

export default SignIn;