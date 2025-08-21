
import "../footer.css";

const Footer = () => {
  // footer should be fixed at the bottom of the page (only when scrolled to bottom)
  return (
    <footer style={{position: "relative", bottom: "-65px"}} className="footer">
        <p>&copy; 2025 SubChck.All right reserved</p>
      <ul className="footer-links">
        <li><a href="#" className="logo">About</a></li>
        <li><a href="#" className="logo">Contact</a></li>
        <li><a href="#" className="logo">Support</a></li>
        <li><a href="#" className="logo">Privacy Policy</a></li>
        <li><a href="#" className="logo">Terms of Service</a></li>
      </ul>
    </footer>
  );
};

export default Footer;