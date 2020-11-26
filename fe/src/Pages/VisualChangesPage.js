import React, { useState, useEffect } from 'react';
import '../CSS/ChangesPage.css';
import VisualComparison from '../Components/VisualComparison';

const visualData1 = [
  {
    id: 1,
    name: 'Page 1',
    link: 'https://google.com',
    timeStamp: '10/02/2020',
    images: [
      {
        timeStamp: '20/11/2020 - 17:45:00',
        name: '../logo.png',
      }, {
        timeStamp: '10/02/2020 - 17:45:00',
        name: '../logo.png',
      },
    ],
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
        name: '../logo.png',
      },
    ],
  },
];

function getListOfUrls(setBeURLReply) {
  console.log('getting urls from db');

  const requestOptions = {
    method: 'GET',
  };

  fetch('http://localhost:8000/urls/', requestOptions)
    .then((res) => {
      if (res.status === 200) {
        res.text()
          .then((content) => setBeURLReply(JSON.parse(content)));
      }
      else if(res.status === 500) {
        // TODO: show error message
      }
    });
}

function getListOfImages(beReplyUrls, setBeReply) {
  console.log('getting images from db');

  const requestOptions = {
    method: 'GET',
  };

  console.log(beReplyUrls);
  console.log(`urls length: ${beReplyUrls.length}`);
  if (beReplyUrls.length > 0) {
    if (beReplyUrls[0].id === undefined) return;
  }

  for (let i = 0; i < beReplyUrls.length; i += 1) {
    console.log(beReplyUrls[i].id);
    console.log(`http://localhost:8000/captures/byPageId/${beReplyUrls[i].id}`);
    fetch(`http://localhost:8000/captures/byPageId/${beReplyUrls[i].id}`, requestOptions)
      .then((res) => res.text())
      .then((res) => setBeReply(JSON.parse(res)));
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
      case 'get_captures': setBeReply(beReply.captures);
        break;
      case 'get_captures_by_page_id': setBeReply(beReply.captures);
        console.log(beReply);
        break;
      case 'delete_capture': console.log('Delete captures');
        break;
      case 'error': console.log(`ERROR => ${beReply.msg}`);
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
          visualData1.map((ub) => (
            <VisualComparison
              pageName={ub.name}
              link={ub.link}
              image1={ub.images[0]}
              image2={ub.images[1]}
            />
          ))
        }
      </div>
    </>
  );
}

export default VisualChangesPage;
