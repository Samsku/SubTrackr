function Hero() {
    return (
      <section className="hero">
        <div className="hero-text">
          <h1>Monitoring Subscriptions Made Simple</h1>
          <p>
            Keep track of all your subscriptions, bills, and memberships without the
            hassle. SubChck helps you save money and never miss a payment.
          </p>
          <div className="button-container">
            <button
              onClick={() =>
                document.getElementById('pricing-section').scrollIntoView({ behavior: 'smooth' })
              }
              className="btn-primary"
            >
              View Plans
            </button>
            <button className="btn-secondary">Learn More</button>
          </div>
        </div>
  
        <div className="hero-image">
          <img src="src/assets/sampleImage.jpg" alt="Bill management services" />
        </div>
      </section>
    );
  }
  
  export default Hero;
  