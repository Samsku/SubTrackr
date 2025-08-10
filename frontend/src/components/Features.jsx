import '../LandingPage.css';

function Features() {
    return (
        <section className="features">
            <h1>Features</h1>
            <section className="features-content">
                <article className="feature">
                    <h3>Manage Payments</h3>
                    <p>Organize your subscriptions and bills in one place, making it easier to keep track of your expenses.</p>
                </article>
                <article className="feature">
                    <h3>Get Reminders</h3>
                    <p>Get reminders for your subscriptions and bills via email, so you don't miss any important dates.</p>
                </article>
                <article className="feature">
                    <h3>Secure Data</h3>
                    <p>SubChck uses secure data encryption to protect your data and ensure that your information is safe.</p>
                </article>
            </section>
        </section>
    )
}

export default Features;
