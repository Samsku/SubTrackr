import NavBar from "./NavBar";
import Footer from "./Footer";
import Dashboard from "./Dashboard";
import "../UserPage.css";

const UserPage = () => {
    return (
        <div className="user-page">
            <NavBar />
            <main>
            < Dashboard />
            </main>
            <Footer />
        </div>
    );
};

export default UserPage;