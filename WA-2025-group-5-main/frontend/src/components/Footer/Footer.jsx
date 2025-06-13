import { Link } from 'react-router-dom';
import './Footer.css';



const Footer = () => {

    return (
        <footer className="footer">
                <div className="footer-links">
                    <Link to="/">Home</Link>
                    <Link to="/contact" className="footer-link">Contact</Link>
                </div>
        </footer>
    );
};

export default Footer;
