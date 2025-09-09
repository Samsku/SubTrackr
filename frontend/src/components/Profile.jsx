import { useState } from 'react';
import { useUser } from '../utils/UserContext';
import ConfirmationModal from './ConfirmationModal';
import { getAuthHeaders, setAuthData } from '../utils/auth';
import '../UserPage.css';

const API_URL = 'http://localhost:3000';

const Profile = () => {
    const { user, setUser, addNotification } = useUser();
    const [isEditing, setIsEditing] = useState(null);
    const [formData, setFormData] = useState({});
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmModalMessage, setConfirmModalMessage] = useState('');
    const [onConfirmAction, setOnConfirmAction] = useState(null);
    const [fieldToSave, setFieldToSave] = useState(null);
    if (!user) {
        return <div className="profile-container"><p>Loading profile...</p></div>;
    }

    const handleEdit = (field) => {
        setIsEditing(field);
        setFormData({ ...formData, [field]: user[field] });
    };

    const handleCancel = () => {
        setIsEditing(null);
        setFormData({});
    };

    const executeSave = async (field) => {
        try {
            if (['name', 'email', 'password'].includes(field)) {
                const response = await fetch(`${API_URL}/user/me`, {
                    method: 'PATCH',
                    headers: getAuthHeaders(),
                    body: JSON.stringify({ [field]: formData[field] }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || `Failed to update ${field}`);
                }

                const updatedUser = await response.json();
                setUser(updatedUser);
                setAuthData(getAuthHeaders().Authorization.split(' ')[1], updatedUser);
                addNotification(`${field} updated successfully`);
            } else if (['phone', 'location'].includes(field)) {
                const updatedUser = { ...user, [field]: formData[field] };
                setUser(updatedUser);
                setAuthData(getAuthHeaders().Authorization.split(' ')[1], updatedUser);
                addNotification(`${field} updated successfully`);
            }
        } catch (error) {
            addNotification(error.message);
            console.error(`Error updating ${field}:`, error);
        } finally {
            setIsEditing(null);
            setFormData({});
            setShowConfirmModal(false);
        }
    };

    const handleSave = (field) => {
        setConfirmModalMessage(`Are you sure you want to save changes to your ${field}?`);
        setOnConfirmAction(() => () => executeSave(field));
        setFieldToSave(field);
        setShowConfirmModal(true);
    };

    const renderField = (label, field, value) => {
        const isEditable = !['Account creation date', 'Last login', 'Subscription plan'].includes(label);
        let inputType = 'text';
        if (field === 'email') inputType = 'email';
        if (field === 'password') inputType = 'password';
        if (field === 'phone') inputType = 'tel';

        return (
            <li className="profile-item">
                <strong>{label}:</strong>
                {isEditing === field ? (
                    <div className="edit-mode">
                        <input
                            type={inputType}
                            value={formData[field] || ''}
                            onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                        />
                        <button onClick={() => handleSave(field)}>Save</button>
                        <button onClick={handleCancel}>Cancel</button>
                    </div>
                ) : (
                    <div className="view-mode">
                        <span>{value}</span>
                        {isEditable && <button onClick={() => handleEdit(field)}>Edit</button>}
                    </div>
                )}
            </li>
        );
    };

    return (
        <div className="profile-container">
            <ul className="profile-details">
                {renderField('Profile Name', 'name', user.name)}
                {renderField('Email', 'email', user.email)}
                {renderField('Password', 'password', '********')}
                {renderField('Phone number', 'phone', user.phone || ' ')}
                {renderField('Location', 'location', user.location || ' ')}
                {renderField('Account creation date', 'createdAt', new Date(user.createdAt).toLocaleDateString())}
                {renderField('Last login', 'lastLogin', new Date(user.lastLogin).toLocaleString())}
                
                {renderField('Subscription plan', 'plan', user.subscriptionPlan)}
            </ul>
        <ConfirmationModal
                message={confirmModalMessage}
                onConfirm={onConfirmAction}
                onCancel={() => setShowConfirmModal(false)}
                isVisible={showConfirmModal}
            />
        </div>
    );
};

export default Profile;

