import '../Authentication.css';
import {Link} from 'react-router-dom';
import {useState} from 'react';



function SignUp() {
    const [formatData, setFormatData]= useState({
        name: '',
        email: '',
        password: ''
    })
    const [sendMessage, setSendMessage] = useState('');

     const handleSubmit = (e) => {
            e.preventDefault();
            registerUser(formatData);
        }
        const handleChange = (e) => {
                setFormatData({
                    ...formatData,
                    [e.target.name]: e.target.value
                });
        }
     const registerUser = async(userData)=>{
        try{
            const response = await fetch('http://localhost:3000/user/signin',{
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                //work on a friendly message when registration is successful
                setSendMessage('Registration successful!');
                setFormatData({name: '',email: '',password: ''});
            } else {
                console.error('Registration failed:', data);
            }
        }catch(error){
            console.error('Error occurred during registration:', error);
        }

    }
    return (
        <div className = "authentication-page">
        <div className="signup-container">
            <form onSubmit={handleSubmit}>
            <h1>Sign Up</h1>
            <input name="name" value={formatData.name} onChange={handleChange} type="text"placeholder="Name" required />
            <input name="email" value={formatData.email} onChange={handleChange} type="email" placeholder="Email" required />
            <input name="password" value={formatData.password} onChange={handleChange} type="password" placeholder="Password" required />

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