import NavBar from "./NavBar";
import "../LandingPage.css";
import Hero from "./Hero";
import Footer from "./Footer";
import Features from "./Features";
import Pricing from "./Pricing";
function LandingPage() {
    return (
        <div className="landing-page">
            <NavBar />
            <Hero/>
            <Features/>
            <Pricing/>
            <Footer />
        </div>
    )
}

export default LandingPage
