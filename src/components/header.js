import React, { useState, useEffect } from "react";
import { Link } from "gatsby";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  }

  return (
    <header className={scrolled ? "scrolled" : ""}>
      <div className="header-inner">
        {/* Center Logo */}
        <div className={`logo-default ${scrolled ? "hidden" : ""}`}>
          <img src="/images/icon.png" alt="Tiger Logo" height="48" />
        </div>

        {/* Scrolled Logo */}
        <div className={`logo-scrolled ${scrolled ? "visible" : ""}`}>
          <img src="" alt="Koyasumi" height="24" />
        </div>

        {/* Hamburger button (visible on mobile) */}
        <button
          type="button"
          className={`hamburger ${menuOpen ? "active" : ""}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navigation */}
        <nav id="main-nav" className={`${menuOpen ? "open" : ""}`}>
          <Link to="/" onClick={() => setMenuOpen(false)}>ILLUSTRATION</Link>
          <Link to="/storyboard" onClick={() => setMenuOpen(false)}>STORYBOARD</Link>
          <Link to="/concept" onClick={() => setMenuOpen(false)}>CONCEPT</Link>
          <Link to="/misc" onClick={() => setMenuOpen(false)}>MISC</Link>
          <Link to="/profile" onClick={() => setMenuOpen(false)}>PROFILE</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
