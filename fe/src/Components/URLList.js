import React from 'react';
import URLLink from './URLLink.js';
import '../CSS/ComparisonComponents.css';

function URLList({ urls, toggleSelected }) {
  return (
    urls.map((url) => <URLLink key={url.id} URLLink={url} toggleSelected={toggleSelected} />)
  );
}

export default URLList;
