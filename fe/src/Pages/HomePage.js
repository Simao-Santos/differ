import React from 'react';
import '../CSS/HomePage.css';
import VisualComparison from '../Components/VisualComparison';

function HomePage() {
  return (
     <>
      <h1>View Page</h1>
      <div className="Visual-Cards">
      <VisualComparison pageName="Page 1" link="https://google.com"/>
      <VisualComparison pageName="Page 2" link="https://react.com"/>
      </div>
     </>
  );
}

export default HomePage;
