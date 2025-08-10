import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import '../LandingPage.css';

function Pricing () {
    const plans = [
        {
            name: "Basic",
            price: "0€/month",
            features: [
                "Track 10 subscriptions",
                "Expense summary",
                "Manage payments",
                "Export your data",
            ],
            unavailable: [
                "Automated reminders",
                "Share with 2-5 users",
                "Monthly reports"
            ]
        },
        {
            name: "Premium",
            price: "10€/month",
            features: [
                "Track unlimited subscriptions",
                "Expense summary",
                "Manage payments",
                "Export your data",
                "Automated reminders",
                "Share with 2-5 users",
                "Monthly reports"
            ],
            unavailable: []
        }
    ]

    return (
        <section className="pricing-card" id="pricing-section">
            <h1>Pricing Plans</h1>
            <p>Choose the plan that best fits your needs.</p>
            <div className="pricing-container">
                {plans.map((plan, index) => (
                    <div key={index} className="pricing-card">
                        <h2>{plan.name}</h2>
                        <p style={{color: "#00b894", fontSize: "1.2rem", fontWeight: "600", marginBottom: "2px"}}>{plan.price}</p>
                        <ul>
                            {plan.features.map((feature, index) => (
                                <li key={index}>
                                    <CheckIcon />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <ul>
                            {plan.unavailable.map((feature, index) => (
                                <li key={index}>
                                    <CloseIcon />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <button>Get Started</button>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default Pricing;
