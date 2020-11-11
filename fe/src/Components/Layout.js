import React, { Component } from 'react';
import '../CSS/Layout.css';
import Header from './Header';
import Footer from './Footer';


class Layout extends Component {
  render() {
    return (
      <>
        <Header />
        <div className="App-pageContent">
          {this.props.children}
        </div>
        <Footer />
      </>
    )
  }
}

export default Layout  
