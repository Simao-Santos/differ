import React, {useState, useRef, useEffect } from 'react';
import '../CSS/ChangesPage.css';
import VisualComparison from '../Components/VisualComparison';

var visualData1 = [
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

  const [visualData, setData] = useState([])
  const [be_reply, setBeReply] = useState('{}')
  const [be_urls_reply, setBeUrlsReply] = useState('{}')

  useEffect(() => {
    getListOfUrls() 

}, []) 
useEffect(() => {
  console.log("be reply")
  console.log(be_urls_reply)
  getListOfImages()
}, [be_urls_reply])

function getListOfUrls() {

    

  console.log('getting urls from db')

  const requestOptions = {
    method: 'GET'
  }

  fetch("http://localhost:8000/urls/", requestOptions)
  .then(res => res.text())
  .then(res => setBeUrlsReply(JSON.parse(res).urls))
  .then(console.log("im done"))

}

function getListOfImages() {

  console.log('getting images from db')

  for(let i = 0; i < be_urls_reply.length; i++){

  const requestOptions = {
    method: 'GET'
  }
  
  fetch("http://localhost:8000/captures?page_id="+be_urls_reply[i].id , requestOptions)
  .then(res => res.text())
  .then(res => setBeReply(res))

  console.log(be_reply)

}
  

}




  return (
     <>
      <div className="Comparison-Cards">
      {
        visualData1.map(function(ub) {

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
