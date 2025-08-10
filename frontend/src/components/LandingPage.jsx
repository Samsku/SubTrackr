import NavBar from "./NavBar";
import "../LandingPage.css";
import Hero from "./Hero";
import Features from "./Features";
function LandingPage() {
    return (
        <div className="landing-page">
            <NavBar />
            <Hero/>
            <Features/>
        </div>
    )
}

export default LandingPage
