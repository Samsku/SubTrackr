function Hero () {
    return (
        <section className = "hero">
            <h1>Monitoring subscribtions is easier now!</h1>
            <p>Staying on track on mulitple subscriptions, bills and membership can be really tiring. </p>
            <p>SubChck deliver a digital solution and it's easy and intuitive.</p>
                
<<<<<<< HEAD
            <section className="hero-content">
                <div className="card">
                    <div className="card-text">
                        <p>From bills to membership-like Netflix, Spotify, your local gym and more we got you covered.
                            With smart tracking you can organize your subscribtions in one place, you can save money and never miss a payment.</p>
                        <div className="button-container">
                            <button onClick={() => document.getElementById('pricing-section').scrollIntoView({ behavior: 'smooth' })} className ="buttons">View plans</button>
                            <button onClick className ="buttons">Find out more</button>                
                        </div>
                    </div>
                    <img src="src/assets/sampleImage.jpg" alt="Bill management services image"/>
                </div>
            </section>

            <section className = "pricing-card" id="pricing-section">
                <h1>Pricing Plans</h1>
                <div className="pricing-container">
                <div className = "pricing-container-basic">
                    <h1>Basic plan</h1>
                    <p>Includes:</p>
                    <p>✓ Up to 10 subscriptions tracking</p>
                    <p>✓ Expense summary</p>
                    <p>✓ Manage payments</p>
                    <p>✓ export your data</p>
                    <p>x Automated reminders</p>
                    <p>x Share with 2-5 users</p>
                    <p>x Monthly reports</p>
                    <p>0€/month</p>
                    </div>
                    <div className = "pricing-container-premium">
                    <h1> Premium Plan</h1>
                    <p>Includes:</p>
                    <p>✓ Unlimited subscriptions tracking</p>
                    <p>✓ Expense summary</p>
                    <p>✓ Manage payments</p>
                    <p>✓ export your data</p>
                    <p>✓ Automated reminders</p>
                    <p>✓ Share with 2-5 users</p>
                    <p>✓ Monthly reports</p>
                    <p>10€/month</p>
                    </div>
                    </div>

=======
            <section>
                <p1 className="second-paragraph">
                    this is an example of paragraph
                </p1>
                <img src="src/assets/sampleImage.jpg" alt="Bill management services image"/>
                <button className ="buttons">View plans</button>
                <button className ="buttons">Find out more</button>
>>>>>>> 0c0ad2682a318ae6eeabc7ae56c354a47761c893
            </section>

        
        </section>
    );
};
export default Hero;