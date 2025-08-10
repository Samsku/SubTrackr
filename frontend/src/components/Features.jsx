import '../LandingPage.css';

function Features() {
    return (
      <section className="features">
        <h1>Features</h1>
        <section className="features-content">
          <article className="feature">
            <h3>Unified Payment Management</h3>
            <p>Easily organize and monitor all your subscriptions and bills in one streamlined dashboard.</p>
          </article>
          <article className="feature">
            <h3>Timely Payment Reminders</h3>
            <p>Receive automated email alerts to never miss a payment or renewal date again.</p>
          </article>
          <article className="feature">
            <h3>Robust Data Security</h3>
            <p>We protect your data with advanced encryption protocols, ensuring complete privacy and safety.</p>
          </article>
        </section>
      </section>
    );
  }
  
export default Features;
