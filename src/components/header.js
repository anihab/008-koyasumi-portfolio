import React, { useState, useEffect } from "react";
import { Link } from "gatsby";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

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

  return (
    <header className={scrolled ? "scrolled" : ""}>
      <div className="header-inner">
        {/* Center Logo */}
        <div className={`logo-default ${scrolled ? "hidden" : ""}`}>
          <img src="/images/top-hat-logo.png" alt="Top Hat Logo" height="48" />
        </div>

        {/* Scrolled Logo */}
        <div className={`logo-scrolled ${scrolled ? "visible" : ""}`}>
          <img src="/images/eve-logo.png" alt="Eve Logo" height="24" />
        </div>

        {/* Navigation */}
        <nav>
          <Link to="/news">NEWS</Link>
          <Link to="/media">MEDIA</Link>
          <Link to="/live">LIVE</Link>
          <Link to="/event">EVENT</Link>
          <Link to="/profile">PROFILE</Link>
          <Link to="/discography">DISCOGRAPHY</Link>
          <Link to="/goods">GOODS</Link>
          <Link to="/download">DOWNLOAD</Link>
          <Link to="/contact">CONTACT</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
