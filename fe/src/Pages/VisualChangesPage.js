import React from 'react';
import '../CSS/ChangesPage.css';
import VisualComparison from '../Components/VisualComparison';

var visualData = [
  {
      id: 1,
      name: 'Page 1',
      link: 'https://google.com',
      timeStamp: '10/02/2020',
      images: [
          {
            timeStamp: '20/11/2020 - 17:45:00',
            name: '../logo.png'
          }, {
            timeStamp: '10/02/2020 - 17:45:00',
            name: '../logo.png'
          }
      ]
  },
  {
      id: 2,
      name: 'Page 2',
      link: 'https://site.com/login',
      images: [
          {
            timeStamp: '20/11/2020 - 17:45:00',
            name: '../logo.png'
            
          }, {
            timeStamp: '10/02/2020 - 17:45:00',
            name: "../logo.png"
          }
      ]
  }
];


function VisualChangesPage() {
  return (
     <>
      <div className="Comparison-Cards">
      {
        visualData.map(function(ub) {

          return (
            <VisualComparison pageName={ub.name} link={ub.link} image1={ub.images[0]} image2={ub.images[1]}/>
          )
      })
      }
      </div>
     </>
  );
}

export default VisualChangesPage;
