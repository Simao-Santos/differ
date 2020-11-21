import React, {useState, useRef, useEffect } from 'react';
import '../CSS/ChangesPage.css';
import VisualComparison from '../Components/VisualComparison';

var info = [];
var comparison = [];

function VisualChangesPage() {

  const [be_reply, setBeReply] = useState('{}')
  const [be_reply_urls, setBeURLReply] = useState('{}')

  useEffect(() => {
    getListOfUrls()

  }, [])

  useEffect(() => {
  
    switch(be_reply.type){
      case 'get_captures':
      break
      case 'get_captures_by_page_id':
      console.log(be_reply)
      setBeReply(be_reply.captures)
      console.log("I received reply")
      console.log(be_reply)
      info.push(be_reply)
      console.log("info stuf")
      console.log(info)
      break
      case 'delete_capture': console.log("Delete captures")
      break
      case 'error': console.log('ERROR => ' + be_reply.msg)
      break
      case 'get_comparisons_by_page_id':
        comparison.push(be_reply.comparisons)
        console.log("comparison stuff")
        console.log(comparison)
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
      fetch('http://localhost:8000/captures/byPageId/' + be_reply_urls[i].id, requestOptions).then(res => res.text()).then(res => setBeReply(JSON.parse(res)))
      fetch('http://localhost:8000/comparisons/byPageId/' + be_reply_urls[i].id, requestOptions).then(res => res.text()).then(res => setBeReply(JSON.parse(res)))
    }

    
  }

    return (
      <>
        <div className="Comparison-Cards">
          {
          info.map((ub , i) => (
            <VisualComparison pageName={"Page "+be_reply_urls[i].id} link={be_reply_urls[i].url} timeStamp1={ub.captures[0].date} timeStamp2={ub.captures[ub.captures.length - 1].date} image1={"http://localhost:8000" + ub.captures[0].image_location} image2={"http://localhost:8000" + ub.captures[ub.captures.length - 1].image_location} />
          ))
          }
        </div>
      </>
    );
}
//comparison={"http://localhost:8000" + comparison[i].comparisons[comparison[i].comparisons.length-1].image_location}

export default VisualChangesPage;
