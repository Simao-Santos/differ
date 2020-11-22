import React from 'react';
import PropTypes from 'prop-types';
import '../CSS/Layout.css';
import Header from './Header';
import Footer from './Footer';

const Layout = (props) => {
  const { children } = props;
  return (
    <>
      <Header />
      <div className="App-pageContent">
        {children}
      </div>
      <Footer />
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.element.isRequired,
};

export default Layout;
