import React from 'react';
import '../CSS/Layout.css';
import Header from './Header';
import Footer from './Footer';
const Layout = ({ children }) => {
    return (
      <>
        <Header />
        <div className="App-pageContent">
          {children}
        </div>
        <Footer/>
      </>
    )
  }
  
  export default Layout  