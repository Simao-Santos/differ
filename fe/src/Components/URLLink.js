import React, { useState } from 'react';
import PropTypes from 'prop-types';
import '../CSS/URLEdition.css';
import '../CSS/PrettyChecks.scss';
import CryptoJS from 'crypto-js';
import getCssSelector from 'css-selector-generator';

export default function URLLink({ link, toggleSelected }) {
  const backgroundOn = link.selected;

  const [showFull, setShowFull] = useState(false);
  const [extHTML, setExtHTML] = useState('<h1>Oops, you\'re not supposed to here</h1>');

  function frameInteraction() {
    const iframe = document.querySelector(`#html-render-${link.id}`);

    console.log("Adding events");
    const iframeBody = iframe.contentWindow.document.querySelector("body");
    iframeBody.addEventListener('mouseover', event => {
      console.log("Entered " + event.target);

      const overlayDiv = document.createElement('div');

      const elemDomRect = event.target.getBoundingClientRect();
      const bodyDomRect = iframeBody.getBoundingClientRect();

      overlayDiv.style.height = `${Math.round(elemDomRect.height)}px`;
      overlayDiv.style.width = `${Math.round(elemDomRect.width)}px`;
      overlayDiv.style.position = 'absolute';
      overlayDiv.style.zIndex = Number.MAX_SAFE_INTEGER;
      overlayDiv.style.top = `${Math.round(elemDomRect.top - bodyDomRect.top)}px`;
      overlayDiv.style.left = `${Math.round(elemDomRect.left - bodyDomRect.left)}px`;

      overlayDiv.style.backgroundColor = 'rgba(0, 0, 180, 0.5)';

      overlayDiv.style.pointerEvents = 'none';

      overlayDiv.className = 'overlayDiv';

      iframeBody.appendChild(overlayDiv);
    });
    iframeBody.addEventListener('mouseout', event => {
      console.log("Exited " + event.target);

      const overlayDivs = iframeBody.querySelectorAll(".overlayDiv");
      console.log(overlayDivs);
      overlayDivs.forEach(element => element.remove());
    });
    iframeBody.addEventListener('click', event => {
      console.log("Clicked " + event.target);

      event.stopPropagation();
      event.preventDefault();

      const cssSelector = getCssSelector(event.target, { selectors: ['class', 'id', 'tag', 'nthchild'] });

      const hash = CryptoJS.MD5(cssSelector).toString(CryptoJS.enc.Base64);

      let selectedDiv = iframeBody.querySelector(`[id='selectedDiv-${hash}']`);

      if (selectedDiv !== null) {
        selectedDiv.remove();
      } else {
        selectedDiv = document.createElement('div');

        const elemDomRect = event.target.getBoundingClientRect();
        const bodyDomRect = iframeBody.getBoundingClientRect();

        selectedDiv.style.height = `${Math.round(elemDomRect.height)}px`;
        selectedDiv.style.width = `${Math.round(elemDomRect.width)}px`;
        selectedDiv.style.position = 'absolute';
        selectedDiv.style.zIndex = Number.MAX_SAFE_INTEGER;
        selectedDiv.style.top = `${Math.round(elemDomRect.top - bodyDomRect.top)}px`;
        selectedDiv.style.left = `${Math.round(elemDomRect.left - bodyDomRect.left)}px`;

        selectedDiv.style.backgroundColor = 'rgba(148, 148, 148, 0.5)';

        selectedDiv.style.pointerEvents = 'none';

        selectedDiv.id = `selectedDiv-${hash}`;

        iframeBody.appendChild(selectedDiv);
      }
    }, true);
  }

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

  function toggleExpand() {
    const divLink = document.querySelector(`#link-${link.id}`);
    const expandButton = document.querySelector(`#expand-button-${link.id}`);

    const iframe = document.querySelector(`#html-render-${link.id}`);
    iframe.onload = frameInteraction;
    
    if (divLink.classList.contains('link-hide')) {
      fetch(`${process.env.REACT_APP_BACKEND_HOST}/captures/byPageId/${link.id}`)
        .then(response => {
          if (response.status === 200) {
            return response.json();
          } else {
            // TODO: handle this error somehow
          }
        })
        .then(content => {
          if (content.length === 0) {
            // TODO: handle this error somehow
          } else {
            // TODO: change file
            fetch(`${process.env.REACT_APP_BACKEND_HOST}${content[content.length - 1].text_location}`)
              .then(res => res.text(), err => {
                // TODO: handle this error somehow
              }
              ).then(htmlContent => {
                // The following code will identify every link that starts with a single "/",
                // which refers to the root of the website,
                // And add the url before it (so it can actually get the content)
                const regex = /"\/(?!\/)/gi;
                const fixedContent = htmlContent.replace(regex, `"${link.url}${(link.url.endsWith('/')) ? '' : '/'}`);

                setExtHTML(fixedContent);
              });
          }
        });

      divLink.classList.remove('link-hide');
      expandButton.textContent = '∧';
    } else {
      divLink.classList.add('link-hide');
      expandButton.textContent = '∨';
    }
  }

  return (
    <>
      <div
        className={`link ${backgroundOn ? 'background-orange-fade' : 'background-orange'}`}
        onMouseEnter={() => setShowFull(true)}
        onMouseLeave={() => setShowFull(false)}
      >
        <div class="link url-link">
          <label htmlFor="id-checkbox" className="checkbox-label checkbox path row">
            <input id="id-checkbox" type="checkbox" checked={link.selected} onChange={handleUrlSelect} />
            {handleUrlSize(link)}
            <svg viewBox="0 0 21 21">
              <path d="M5,10.75 L8.5,14.25 L19.4,2.3 C18.8333333,1.43333333 18.0333333,1 17,1 L4,1 C2.35,1 1,2.35 1,4 L1,17 C1,18.65 2.35,20 4,20 L17,20 C18.65,20 20,18.65 20,17 L20,7.99769186" />
            </svg>
          </label>
          <button id={`expand-button-${link.id}`} class="expand-button" onClick={toggleExpand}>
            ∨
          </button>
        </div>
        <div id={`link-${link.id}`} class="link url-elements link-hide">
          <div>
            <iframe id={`html-render-${link.id}`} class="html-render" sandbox="allow-same-origin allow-scripts" srcdoc={extHTML}>
            </iframe>
          </div>
        </div>
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
