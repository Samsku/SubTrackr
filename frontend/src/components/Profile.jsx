import {getUser} from '../utils/auth';
const Profile = () => {
    const user = getUser()
    return (

        //style in css 
        <div className="profile-container">
            <ul className="profile-details">
                <li><strong>Profile Name:</strong>
                    {user.name}</li>

                    <img></img>
                    <li><strong>Email:</strong>{user.email}</li>
                    <li><strong>Password:</strong></li>
                    <li><strong>Phone number:</strong></li>
                    <li><strong>Location:</strong></li>
                    <li><strong>Account creation date:</strong></li>
                    <li><strong>Last login:</strong></li>
                    <li><strong>Subscription plan:</strong></li>
                               

            </ul>
            
            
        </div>
    );
};

export default Profile;
