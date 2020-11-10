import React, {useState, useRef, useEffect } from 'react';
import '../CSS/ChangesPage.css';
import VisualComparison from '../Components/VisualComparison';

var visualData1 =[
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
            name: '../logo.png',
            id: 2,
          }, {
            timeStamp: '10/02/2020 - 17:45:00',
            name: "../logo.png"
          }
      ]
  }
];


function VisualChangesPage() {

  const [be_reply, setBeReply] = useState('{}')
  const [be_reply_urls, setBeURLReply] = useState('{}')

  useEffect(() => {
    getListOfUrls() 

  }, []) 

  useEffect(() => {
  
    switch(be_reply.type){
      case 'get_captures': setBeReply(be_reply.captures)
      break
      case 'get_captures_by_page_id':setBeReply(be_reply.captures)
      console.log(be_reply)
      break
      case 'delete_capture': console.log("Delete captures")
      break
      case 'error': console.log('ERROR => ' + be_reply.msg)
      break
    }
  
  }, [be_reply]) 

  useEffect(() => {
    console.log(be_reply_urls)
   
    getListOfImages()
  }, [be_reply_urls])
        
  function getListOfUrls() {   

    console.log('getting urls from db')

    const requestOptions = {
      method: 'GET'
    }

    fetch("http://localhost:8000/urls/", requestOptions)
    .then(res => res.text())
    .then(res => setBeURLReply(JSON.parse(res).urls))
  }

  function getListOfImages() {

    console.log('getting images from db')

    const requestOptions = {
      method: 'GET'
    }

    console.log(be_reply_urls)
    console.log("urls length" + be_reply_urls.length)
    if(be_reply_urls.length > 0){
      if( be_reply_urls[0].id == undefined)
      return;
    }
    
    for( var i=0 ; i<be_reply_urls.length ; i++){
      console.log(be_reply_urls[i].id)
      console.log('http://localhost:8000/captures/byPageId/' + be_reply_urls[i].id)
    fetch('http://localhost:8000/captures/byPageId/' + be_reply_urls[i].id, requestOptions)
    .then(res => res.text())
    .then(res => setBeReply(JSON.parse(res)))
    }
  }

    return (
      <>
        <div className="Comparison-Cards">
          {
          visualData1.map((ub) => (
            <VisualComparison pageName={ub.name} link={ub.link} image1={ub.images[0]} image2={ub.images[1]} />
          ))
        }
        </div>
      </>
    );
  
  
  
}

export default VisualChangesPage;
