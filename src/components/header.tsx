import React from "react";
import "../App.css";

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="header-container">
      <h1>{title}</h1>
      <div className="user-icon">RV</div>
    </header>
  );
};

export default Header;
