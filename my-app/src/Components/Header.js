import React from 'react';
import '../CSS/HomePage.css';

function Header(){
    return (
        <div className="App-header">
        <img src="../logo2.png" className="App-logo" alt="logo" />
        <p>
          This is a header
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          LogInSpace
        </a>
        </div>
    );
}

export default Header;