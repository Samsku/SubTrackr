import NavBar from "./NavBar";
import "../LandingPage.css";
import Hero from "./Hero";
import Footer from "./Footer";
function LandingPage() {
    return (
        <div className="landing-page">
            <NavBar />
            <Hero/>
            <Footer />
        </div>
    )
}

export default LandingPage
