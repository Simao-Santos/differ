import React, { useState } from 'react';
import PropTypes from 'prop-types';
import '../CSS/URLEdition.css';
import '../CSS/PrettyChecks.scss';
import CryptoJS from 'crypto-js';
import getCssSelector from 'css-selector-generator';
import Spinner from 'react-bootstrap/Spinner';
import ElementSelectorList from './ElementSelectorList';

export default function URLLink({ link, toggleSelected }) {
  const backgroundOn = link.selected;

  const [showFull, setShowFull] = useState(false);
  const [extHTML, setExtHTML] = useState('<h1>Oops, you\'re not supposed to here</h1>');

  // variable that holds selected IDs
  const [elementIdentifiers, setElementIdentifiers] = useState([{ id: 1, pageId: 1, elementSelector: '#main_news' }, { id: 2, pageId: 2, elementSelector: '#page_main > div > div:nth-child(6)' }]);

  function mouseOver(event) {
    console.log(`Entered ${event.target}`);
    const iframeBody = this;

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
  }

  function mouseOut(event) {
    console.log(`Exited ${event.target}`);
    const iframeBody = this;

    const overlayDivs = iframeBody.querySelectorAll('.overlayDiv');
    console.log(overlayDivs);
    overlayDivs.forEach((element) => element.remove());
  }

  function mouseClick(event) {
    console.log(`Clicked ${event.target}`);
    const iframeBody = this;

    event.stopPropagation();
    event.preventDefault();

    const cssSelector = getCssSelector(event.target, { selectors: ['class', 'id', 'tag', 'nthchild'] });

    const hash = CryptoJS.MD5(cssSelector).toString(CryptoJS.enc.Base64);

    let selectedDiv = iframeBody.querySelector(`[id='selectedDiv-${hash}']`);

    if (selectedDiv !== null) {
      selectedDiv.remove();

      // TODO request to delete css selector path from the backend
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

      // TODO request to save css selector in the backend
    }
  }

  function frameInteraction() {
    console.log('Adding events');

    const iframe = this;
    const iframeBody = iframe.contentWindow.document.querySelector('body');

    // TODO request gray zones from database and create them

    const elementList = [{ id: 1, page_id: 1, element_selector: '#main_news' }, { id: 2, page_id: 2, element_selector: '#page_main > div > div:nth-child(6)' }];

    setTimeout(() => {
      for (let i = 0; i < elementList.length; i += 1) {
        const elem = iframe.contentWindow.document.querySelector(elementList[i].element_selector);
        const cssSelector = getCssSelector(elem, { selectors: ['class', 'id', 'tag', 'nthchild'] });

        const hash = CryptoJS.MD5(cssSelector).toString(CryptoJS.enc.Base64);

        const selectedDiv = document.createElement('div');

        const elemDomRect = elem.getBoundingClientRect();
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

      iframeBody.addEventListener('mouseover', mouseOver);
      iframeBody.addEventListener('mouseout', mouseOut);
      iframeBody.addEventListener('click', mouseClick, true);

      const spinner = document.querySelector(`#spinner-${link.id}`);
      spinner.classList.add('link-hide');
      iframe.classList.remove('iframe-hide');
    }, 3000);
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
    const spinner = document.querySelector(`#spinner-${link.id}`);

    const expandButton = document.querySelector(`#expand-button-${link.id}`);

    const iframe = document.querySelector(`#html-render-${link.id}`);

    iframe.onload = null;
    iframe.classList.add('iframe-hide');
    spinner.classList.remove('link-hide');

    if (divLink.classList.contains('link-hide')) {
      fetch(`${process.env.REACT_APP_BACKEND_HOST}/captures/byPageId/${link.id}`)
        .then((response) => {
          if (response.status === 200) {
            response.json()
              .then((content) => {
                if (content.length === 0) {
                  setExtHTML('<h1>There has been an error processing the page</h1>');
                } else {
                  fetch(`${process.env.REACT_APP_BACKEND_HOST}${content[content.length - 1].text_location}`)
                    .then((res) => {
                      if (res.status === 200) {
                        res.text()
                          .then((htmlContent) => {
                            iframe.onload = frameInteraction;

                            // The following code will identify every link
                            // that starts with a single "/",
                            // which refers to the root of the website,
                            // And add the url before it (so it can actually get the content)
                            const regex = /"\/(?!\/)/gi;
                            const fixedContent = htmlContent.replace(regex, `"${link.url}${(link.url.endsWith('/')) ? '' : '/'}`);

                            setExtHTML(fixedContent);
                          });
                      } else {
                        setExtHTML('<h1>There has been an error processing the page</h1>');
                      }
                    });
                }
              });
          } else {
            setExtHTML('<h1>There has been an error processing the page</h1>');
          }
        });

      divLink.classList.remove('link-hide');
      expandButton.textContent = '∧';
    } else {
      divLink.classList.add('link-hide');

      expandButton.textContent = '∨';

      setExtHTML('<h1>Oops, you\'re not supposed to here</h1>');
    }
  }

  return (
    <>
      <div
        className={`link ${backgroundOn ? 'background-orange-fade' : 'background-orange'}`}
        onMouseEnter={() => setShowFull(true)}
        onMouseLeave={() => setShowFull(false)}
      >
        <div className="link url-link">
          <label htmlFor="id-checkbox" className="checkbox-label checkbox path row">
            <input id="id-checkbox" type="checkbox" checked={link.selected} onChange={handleUrlSelect} />
            {handleUrlSize(link)}
            <svg viewBox="0 0 21 21">
              <path d="M5,10.75 L8.5,14.25 L19.4,2.3 C18.8333333,1.43333333 18.0333333,1 17,1 L4,1 C2.35,1 1,2.35 1,4 L1,17 C1,18.65 2.35,20 4,20 L17,20 C18.65,20 20,18.65 20,17 L20,7.99769186" />
            </svg>
          </label>
          <button type="button" id={`expand-button-${link.id}`} className="expand-button" onClick={toggleExpand}>
            ∨
          </button>
        </div>
        <div id={`link-${link.id}`} className="link url-elements link-hide">
          <div className="iframe-div">
            <div id={`spinner-${link.id}`} className="spinner">
              <Spinner animation="border" variant="dark" />
            </div>
            <iframe id={`html-render-${link.id}`} className="html-render iframe-hide" sandbox="allow-same-origin allow-scripts" srcDoc={extHTML} title={link.url} />
          </div>
          <div className="element-manager">
            <div className="input-holder">
              <input type="text" placeholder="Type css selector of element"></input>
              <button>+</button>
            </div>
            <div className="element-list">
              <ElementSelectorList elementIdentifiers={elementIdentifiers} />
            </div>
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
