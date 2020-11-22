import React, { useState } from 'react';
import PropTypes from 'prop-types';
import '../CSS/URLEdition.css';
import '../CSS/PrettyChecks.scss';

export default function URLLink({ link, toggleSelected }) {
  const backgroundOn = link.selected;

  const [showFull, setShowFull] = useState(false);

  function handleUrlSelect() {
    return toggleSelected(link.id);
  }

  function isUrlTooBig(auxLink) {
    if (auxLink.url.length > 80) {
      return true;
    }
    return false;
  }

  function handleUrlSize(auxLink) {
    if (isUrlTooBig(auxLink)) {
      return `${auxLink.url.substring(0, 65)} (...)`;
    }
    return auxLink.url;
  }

  return (
    <>
      <div
        className={`link ${backgroundOn ? 'background-orange-fade' : 'background-orange'}`}
        onMouseEnter={() => setShowFull(true)}
        onMouseLeave={() => setShowFull(false)}
      >
        <label htmlFor="id-checkbox" className="checkbox path row">
          <input id="id-checkbox" type="checkbox" checked={link.selected} onChange={handleUrlSelect} />
          {handleUrlSize(link)}
          <svg viewBox="0 0 21 21">
            <path d="M5,10.75 L8.5,14.25 L19.4,2.3 C18.8333333,1.43333333 18.0333333,1 17,1 L4,1 C2.35,1 1,2.35 1,4 L1,17 C1,18.65 2.35,20 4,20 L17,20 C18.65,20 20,18.65 20,17 L20,7.99769186" />
          </svg>
        </label>
      </div>
      {
        showFull && isUrlTooBig(link) && (
          <div className="full-url-box">
            { link.url}
          </div>
        )
      }
    </>
  );
}

URLLink.propTypes = {
  toggleSelected: PropTypes.func.isRequired,
  link: PropTypes.exact({
    selected: PropTypes.bool.isRequired,
    id: PropTypes.number.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
};
