import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import "../css/FrontNavbar.css";

const FrontNavbar = () => {
  const [isMegaOpen, setIsMegaOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navRef = useRef(null);
  const isMobile = window.innerWidth <= 768;

  // Detect scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mega menu when mobile menu closes
  useEffect(() => {
    if (!isMenuOpen) {
      setIsMegaOpen(false);
    }
  }, [isMenuOpen]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menu on resize if it becomes desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={`header ${scrolled ? "scrolled" : ""}`}>
      <div className="header-container">
        <div className="logo">MySite</div>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-btn"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Navigation */}
        <nav 
          ref={navRef}
          className={`nav ${isMenuOpen ? "open" : ""}`}
        >
          <NavLink 
            to="/home" 
            className="nav-linkk"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </NavLink>

          <div
            className="nav-item"
            onMouseEnter={() => !isMobile && setIsMegaOpen(true)}
            onMouseLeave={() => !isMobile && setIsMegaOpen(false)}
          >
            <button 
              className="nav-linkk"
              onClick={() => {
                if (isMobile) {
                  setIsMegaOpen(!isMegaOpen);
                }
              }}
              aria-expanded={isMegaOpen}
            >
              Services
            </button>

            {isMegaOpen && (
              <div className="mega-menu">
                <div className="mega-column">
                  <h4 className="mega-title">Web Development</h4>
                  <ul>
                    <li><NavLink to="/services/react" onClick={() => setIsMenuOpen(false)}>React</NavLink></li>
                    <li><NavLink to="/services/vue" onClick={() => setIsMenuOpen(false)}>Vue</NavLink></li>
                    <li><NavLink to="/services/nextjs" onClick={() => setIsMenuOpen(false)}>Next.js</NavLink></li>
                  </ul>
                </div>
                <div className="mega-column">
                  <h4 className="mega-title">Design</h4>
                  <ul>
                    <li><NavLink to="/services/uiux" onClick={() => setIsMenuOpen(false)}>UI/UX</NavLink></li>
                    <li><NavLink to="/services/branding" onClick={() => setIsMenuOpen(false)}>Branding</NavLink></li>
                    <li><NavLink to="/services/illustration" onClick={() => setIsMenuOpen(false)}>Illustration</NavLink></li>
                  </ul>
                </div>
                <div className="mega-column">
                  <h4 className="mega-title">Marketing</h4>
                  <ul>
                    <li><NavLink to="/services/seo" onClick={() => setIsMenuOpen(false)}>SEO</NavLink></li>
                    <li><NavLink to="/services/content" onClick={() => setIsMenuOpen(false)}>Content</NavLink></li>
                    <li><NavLink to="/services/social-media" onClick={() => setIsMenuOpen(false)}>Social Media</NavLink></li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          <NavLink 
            to="/login" 
            className="nav-linkk"
            onClick={() => setIsMenuOpen(false)}
          >
            Login
          </NavLink>
          
          <NavLink 
            to="/contact" 
            className="nav-linkk"
            onClick={() => setIsMenuOpen(false)}
          >
            Contact
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default FrontNavbar;
