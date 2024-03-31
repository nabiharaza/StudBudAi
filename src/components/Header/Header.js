// TopNavbar.js

import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <div className="top-navbar">
      <div className="logo">Your Logo</div>
      <div className="menu">
        <ul>
          <li><a href="#">Home</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Services</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </div>
    </div>
  );
};

export default Header;
