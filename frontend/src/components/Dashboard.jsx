import React,{useState} from 'react';
import Subscription from './Subscription';
const Dashboard = () => {
    const [subDashboard, setsubDashboard] = useState();
    const [activeModal, setActiveModal] = useState(null);
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
            <Subscription />
        </div>
    );
};

export default Dashboard;