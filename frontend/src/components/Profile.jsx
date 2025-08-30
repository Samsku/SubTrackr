import {getUser} from '../utils/auth';
import '../UserPage.css';
const Profile = () => {
    const user = getUser()
    return (

        //style in css 
        <div className="profile-container">
            <ul className="profile-details">
                <li className="profile-item" style={{marginBottom: "0"}}><strong>Profile Name:</strong>
                    {user.name}</li>

                    <img></img>
                    <li className="profile-item"><strong>Email:</strong>{user.email}</li>
                    <li className="profile-item"><strong>Password:</strong></li>
                    <li className="profile-item"><strong>Phone number:</strong></li>
                    <li className="profile-item"><strong>Location:</strong></li>
                    <li className="profile-item"><strong>Account creation date:</strong></li>
                    <li className="profile-item"><strong>Last login:</strong></li>
                    <li className="profile-item"><strong>Subscription plan:</strong></li>
                               

            </ul>
            
            
        </div>
    );
};

export default Profile;
