import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../CSS/URLEdition.css';
import '../CSS/PrettyChecks.scss';
import CryptoJS from 'crypto-js';
import getCssSelector from 'css-selector-generator';
import Spinner from 'react-bootstrap/Spinner';
import ElementSelectorList from './ElementSelectorList';

export default function URLLink({
  link, toggleSelected, setNotificationMsg, setAnimationState,
}) {
  const backgroundOn = link.selected;

  const [showFull, setShowFull] = useState(false);
  const [extHTML, setExtHTML] = useState('<h1>Oops, you\'re not supposed to here</h1>');
  const [elementIdentifiers, setElementIdentifiers] = useState([]);
  const newSelectorRef = useRef();
  const getElementIdentifiers = useRef(() => { });

  function statusToString(operation, status) {
    switch (operation) {
      case 'get':
        if (status === 500) {
          setNotificationMsg('There was a problem with the server.');
        }
        break;
      case 'delete':
        switch (status) {
          case 200:
            setNotificationMsg('Gray zone removed.');
            break;
          case 404:
            setNotificationMsg('Gray zone was not found. Try reloading the page.');
            break;
          case 500:
            setNotificationMsg('There was a problem with the server.');
            break;
          default:
            break;
        }
        break;
      case 'post':
        switch (status) {
          case 200:
            setNotificationMsg('Gray zone added.');
            break;
          case 404:
            setNotificationMsg('Associated page was not found.');
            break;
          case 500:
            setNotificationMsg('There was a problem with the server.');
            break;
          default:
            break;
        }
        break;
      default:
        break;
    }
  }

  getElementIdentifiers.current = () => {
    console.log('getting identifiers from db');

    const requestOptions = {
      method: 'GET',
    };

    const endpoint = new URL(`/gray_zones/${link.id}`, process.env.REACT_APP_BACKEND_HOST);
    fetch(endpoint.toString(), requestOptions)
      .then((res) => {
        res.text()
          .then((content) => setElementIdentifiers(JSON.parse(content)))
          .then(() => statusToString('get', res.status));
      });

    setAnimationState(false);
  };

  function handleAddSelector() {
    const newSelector = newSelectorRef.current.value;

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({ page_id: link.id, gray_zone: newSelector }),
    };

    const endpoint = new URL('/gray_zones/', process.env.REACT_APP_BACKEND_HOST);
    fetch(endpoint.toString(), requestOptions)
      .then((res) => {
        res.text()
          .then(() => getElementIdentifiers.current())
          .then(() => statusToString('post', res.status));
      });

    setAnimationState(false);
    newSelectorRef.current.value = null;
  }

  function deleteSelector(grayZoneId) {
    const requestOptions = {
      method: 'DELETE',
    };

    const endpoint = new URL(`/gray_zones/${grayZoneId}`, process.env.REACT_APP_BACKEND_HOST);
    fetch(endpoint.toString(), requestOptions)
      .then((res) => {
        res.text()
          .then(() => getElementIdentifiers.current())
          .then(() => statusToString('delete', res.status));
      });

    setAnimationState(false);
  }

  useEffect(() => {
    getElementIdentifiers.current();
  }, []);

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
  }

  function frameInteraction() {
    console.log('Adding events');

    const iframe = this;
    const iframeBody = iframe.contentWindow.document.querySelector('body');

    const elementList = [{ id: 1, page_id: 1, element_selector: '#main_news' }, { id: 2, page_id: 2, element_selector: '#page_main > div > div:nth-child(6)' }];

    setTimeout(() => {
      for (let i = 0; i < elementList.length; i += 1) {
        // This try catch is for handling cases where the 'drawer' is closed just after
        // the page is loaded and it starts adding the events
        // Since the 'drawer' is collapse, there is no page anymore, causing errors
        try {
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
        } catch (err) {
          console.log(err);
          console.log('Drawer has been closed, aborting event adding');
          return;
        }
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
    const errorHtml = '<h1>There has been an error processing the page</h1>';

    const divLink = document.querySelector(`#link-${link.id}`);
    const spinner = document.querySelector(`#spinner-${link.id}`);

    const expandButton = document.querySelector(`#expand-button-${link.id}`);

    const iframe = document.querySelector(`#html-render-${link.id}`);

    iframe.onload = null;
    iframe.classList.add('iframe-hide');
    spinner.classList.remove('link-hide');

    if (divLink.classList.contains('link-hide')) {
      const endpointFile = new URL(`/captures/byPageId/${link.id}`, process.env.REACT_APP_BACKEND_HOST);
      fetch(endpointFile.toString())
        .then((response) => {
          if (response.status === 200) {
            response.json()
              .then((content) => {
                if (content.length === 0) {
                  spinner.classList.add('link-hide');
                  setExtHTML(errorHtml);
                  iframe.classList.remove('iframe-hide');
                } else {
                  const endpointContent = new URL(content[content.length - 1].text_location,
                    process.env.REACT_APP_BACKEND_HOST);
                  fetch(endpointContent)
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
                        spinner.classList.add('link-hide');
                        setExtHTML(errorHtml);
                        iframe.classList.remove('iframe-hide');
                      }
                    });
                }
              });
          } else {
            spinner.classList.add('link-hide');
            setExtHTML(errorHtml);
            iframe.classList.remove('iframe-hide');
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
              <input type="text" ref={newSelectorRef} placeholder="Type css selector of element" />
              <button type="button" onClick={handleAddSelector}>+</button>
            </div>
            <div className="element-list">
              <ElementSelectorList
                elementIdentifiers={elementIdentifiers}
                deleteSelector={deleteSelector}
                setNotificationMsg={setNotificationMsg}
              />
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
  setNotificationMsg: PropTypes.func.isRequired,
  setAnimationState: PropTypes.func.isRequired,
  toggleSelected: PropTypes.func.isRequired,
  link: PropTypes.exact({
    selected: PropTypes.bool.isRequired,
    id: PropTypes.number.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
};
