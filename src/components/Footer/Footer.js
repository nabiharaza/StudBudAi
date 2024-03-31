// BottomNavbar.js

import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <div className="bottom-navbar">
      <div className="links">
        <ul>
          <li><a href="#">Privacy Policy</a></li>
          <li><a href="#">Terms of Service</a></li>
          <li><a href="#">FAQ</a></li>
        </ul>
      </div>
      <div className="social-icons">
        <a href="#"><i className="fab fa-facebook"></i></a>
        <a href="#"><i className="fab fa-twitter"></i></a>
        <a href="#"><i className="fab fa-instagram"></i></a>
      </div>
    </div>
  );
};

export default Footer;
