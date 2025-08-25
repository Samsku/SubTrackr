import '../Authentication.css';
import {Link, useNavigate} from 'react-router-dom';
import {useState} from 'react';
import { setAuthData } from '../utils/auth';

function SignIn() {
    const navigate = useNavigate();
    const [credentials, setCredentials]= useState({
        email: '',
        password: ''
});

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        LogUser(credentials);
    }
    const LogUser = async(credentials)=>{
        try{
            const response = await fetch('http://localhost:3000/user/login',{
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials)
            });
            const data = await response.json();
            if (response.ok) {
                setAuthData(data.token, data.user);
                alert('Login successful!');
                navigate('/dashboard');
            } else {
                alert('Login failed: ' + data.message);
            }
        }catch(error){
            console.error('Error occurred during login:', error);
        }
    }

    return (
        <div className = "authentication-page">
        <div className="signup-container">
            <form onSubmit={handleSubmit}>
                <h1>Sign In</h1>
                <input type="email" name="email" value={credentials.email} onChange={handleChange} placeholder="Email" required />
                <input type="password" name="password" value={credentials.password} onChange={handleChange} placeholder="Password" required />

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