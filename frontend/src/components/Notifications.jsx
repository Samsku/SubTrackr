import { useUser } from '../utils/UserContext';

const Notifications = () => {
    const { notifications, clearNotifications } = useUser();

    return (
        <div className="notifications">
            <h2>Notifications</h2>
            {notifications.length > 0 ? (
                <button onClick={clearNotifications} className="export-csv">Clear Notifications</button>
            ) : null}
            {notifications.map((notification) => (
                <div key={notification.id} className="notification">
                    {notification.message}
                </div>
            ))}
        </div>
    );
};

export default Notifications;
