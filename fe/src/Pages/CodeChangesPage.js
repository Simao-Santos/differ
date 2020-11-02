import React from 'react';
import '../CSS/ChangesPage.css';
import CodeComparison from '../Components/CodeComparison';

var codeData = [
  {
    id: 1,
    name: 'Page 1',
    link: 'https://google.com',
    timeStamp: '10/02/2020',
    codes: [
      {
        timeStamp: '20/11/2020 - 17:45:00',
        name: '../code.png'
      }, {
        timeStamp: '10/02/2020 - 17:45:00',
        name: '../code.png'
      }
    ]
  },
  {
    id: 2,
    name: 'Page 2',
    link: 'https://site.com/login',
    codes: [
      {
        timeStamp: '20/11/2020 - 17:45:00',
        name: '../code.png'

      }, {
        timeStamp: '10/02/2020 - 17:45:00',
        name: "../code.png"
      }
    ]
  }
];


function CodeChangesPage() {
  return (
    <>
      <div className="Comparison-Cards">
        {
          codeData.map(function (ub) {

            return (
              <CodeComparison pageName={ub.name} link={ub.link} code1={ub.codes[0]} code2={ub.codes[1]} />
            )
          })
        }
      </div>
    </>
  );
}

export default CodeChangesPage;
