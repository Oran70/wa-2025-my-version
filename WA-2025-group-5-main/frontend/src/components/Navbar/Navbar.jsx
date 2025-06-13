import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import logo from '../../assets/logoEduPlan.svg';
import logoSchool from '../../assets/logoSchool.png';
import burgerMenuIcon from '../../assets/menu-burger.svg';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">

                {/* LOGO BLOK */}
                <div className="navbar-logos">
                    <img className="navbar-school-logo" src={logoSchool} alt="Schoollogo" />
                    <Link to="/" className="navbar-logo">
                        <img className="navbar-logo-img" src={logo} alt="EduPlan logo" />
                    </Link>
                </div>

                {/* Mobile menu button */}
                <div className="menu-icon" onClick={() => toggleMenu()}>
                    <img src={burgerMenuIcon} alt="Menu" className="burger-menu-icon" />
                </div>

                {/* Navigation links */}
                <ul className={isMenuOpen ? 'nav-menu active' : 'nav-menu'}>
                    <div className="nav-buttons-container">
                        <Link
                            to="/code"
                            className="nav-button btn-yellow"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Plan afspraak
                        </Link>
                        <Link to="/login" className="nav-button login">
                            Log in
                        </Link>
                    </div>
                </ul>

                {/* Auth buttons */}
                <div className="nav-auth">
                    <Link to="/contact">
                        Contact
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
