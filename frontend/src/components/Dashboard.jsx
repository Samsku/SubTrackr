import React,{useState} from 'react';
import Subscription from './Subscription';
import Profile from './Profile';
import PaymentMethods from './PaymentMethods';
import Billing from './Billing';
import Notifications from './Notifications';
const Dashboard = () => {

    const [activeModal, setActiveModal] = useState(null);

    const handleOption = () => {
        switch (activeOption) {
            case "subscriptions":
                setActiveModal("subscription");
                break;
            case "profile":
                setActiveModal("profile");
                break;
            case "payment methods":
                setActiveModal("payment");
                break;
            case "billing":
                setActiveModal("billing");
                break;
            case "notifications":
                setActiveModal("notifications");
                break;
        }
    }
    const settings= [
        {name:"Subscriptions", modalId: "subscription"},
        {name:"Profile", modalId:"profile"},
        {name:"Payment methods", modalId:"payment"},
        {name:"Billing", modalId:"billing"},
        {name:"Notifications",modalId:"notifications"},
    ]
    return (
        <div className = "dashboard">
            <div className="settings-list">
                {settings.map((setting) => (
                    <div key={setting.name} className="setting-item">
                         <button className="settings-button"onClick={() => setActiveModal(setting.modalId)}>{setting.name}
  </button>
                    </div>
                ))}
            </div>
            <div className="modal-container">
                {activeModal === "subscription" && <Subscription />}
                {activeModal === "profile" && <Profile />}
                {activeModal === "payment" && <PaymentMethods />}
                {activeModal === "billing" && <Billing />}
                {activeModal === "notifications" && <Notifications />}
            </div>
        </div>
    );
};

export default Dashboard;