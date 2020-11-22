import React, { useState, useEffect } from 'react';
import '../CSS/ChangesPage.css';
import VisualComparison from '../Components/VisualComparison';

const info = [];
const comparison = [];

function getListOfUrls(setBeURLReply) {
  console.log('getting urls from db');

  const requestOptions = {
    method: 'GET',
  };

  fetch('http://localhost:8000/urls/', requestOptions)
    .then((res) => res.text())
    .then((res) => setBeURLReply(JSON.parse(res).urls));
}

function getListOfImages(beReplyUrls, setBeReply) {
  console.log('getting images from db');

  const requestOptions = {
    method: 'GET',
  };

  console.log(beReplyUrls);
  console.log(`urls length${beReplyUrls.length}`);
  if (beReplyUrls.length > 0) {
    if (beReplyUrls[0].id === undefined) return;
  }

  for (let i = 0; i < beReplyUrls.length; i = +1) {
    console.log(beReplyUrls[i].id);
    console.log(`http://localhost:8000/captures/byPageId/${beReplyUrls[i].id}`);
    fetch(`http://localhost:8000/captures/byPageId/${beReplyUrls[i].id}`, requestOptions).then((res) => res.text()).then((res) => setBeReply(JSON.parse(res)));
    fetch(`http://localhost:8000/comparisons/byPageId/${beReplyUrls[i].id}`, requestOptions).then((res) => res.text()).then((res) => setBeReply(JSON.parse(res)));
  }
}

function VisualChangesPage() {
  const [beReply, setBeReply] = useState('{}');
  const [beReplyUrls, setBeURLReply] = useState('{}');

  useEffect(() => {
    getListOfUrls(setBeURLReply);
  }, []);

  useEffect(() => {
    switch (beReply.type) {
      case 'get_captures':
        break;
      case 'get_captures_by_page_id':
        console.log(beReply);
        setBeReply(beReply.captures);
        console.log('I received reply');
        console.log(beReply);
        info.push(beReply);
        console.log('info stuf');
        console.log(info);
        break;
      case 'delete_capture': console.log('Delete captures');
        break;
      case 'error': console.log(`ERROR => ${beReply.msg}`);
        break;
      case 'get_comparisons_by_page_id':
        comparison.push(beReply.comparisons);
        console.log('comparison stuff');
        console.log(comparison);
        break;
      default:
        break;
    }
  }, [beReply]);

  useEffect(() => {
    console.log(beReplyUrls);

    getListOfImages(beReplyUrls, setBeReply);
  }, [beReplyUrls]);

  return (
    <>
      <div className="Comparison-Cards">
        {
          info.map((ub, i) => (
            <VisualComparison pageName={`Page ${beReplyUrls[i].id}`} link={beReplyUrls[i].url} timeStamp1={ub.captures[0].date} timeStamp2={ub.captures[ub.captures.length - 1].date} image1={`http://localhost:8000${ub.captures[0].image_location}`} image2={`http://localhost:8000${ub.captures[ub.captures.length - 1].image_location}`} />
          ))
          }
      </div>
    </>
  );
}
// comparison={"http://localhost:8000" + comparison[i].comparisons[comparison[i].comparisons.length-1].image_location}

export default VisualChangesPage;
