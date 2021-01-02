import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../CSS/URLEdition.css';
import '../CSS/PrettyChecks.scss';
import CryptoJS from 'crypto-js';
import getCssSelector from 'css-selector-generator';
import Spinner from 'react-bootstrap/Spinner';
import ElementSelectorList from './ElementSelectorList';

class URLLink extends Component {
  static isUrlTooBig(auxLink) {
    if (auxLink.url.length > 80) {
      return true;
    }
    return false;
  }

  static handleUrlSize(auxLink) {
    if (URLLink.isUrlTooBig(auxLink)) {
      return `${auxLink.url.substring(0, 65)} (...)`;
    }
    return auxLink.url;
  }

  static mouseOver(iframeBody, event) {
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

  static mouseOut(iframeBody) {
    const overlayDivs = iframeBody.querySelectorAll('.overlayDiv');
    overlayDivs.forEach((element) => element.remove());
  }

  constructor(props) {
    super(props);

    this.props = props;

    this.state = {
      backgroundOn: props.link.selected,
      showFull: false,
      extHTML: '<h1>Oops, you\'re not supposed to here</h1>',
      elementIdentifiers: [],
      divList: [],
      currentInput: '',
    };

    this.frameInteraction = this.frameInteraction.bind(this);
    this.handleUrlSelect = this.handleUrlSelect.bind(this);
    this.handleAddSelector = this.handleAddSelector.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.deleteSelector = this.deleteSelector.bind(this);
    this.toggleExpand = this.toggleExpand.bind(this);
  }

  componentDidMount() {
    this.fetchGrayZones();
  }

  handleInputChange(e) {
    this.setState({ currentInput: e.target.value });
  }

  handleUrlSelect() {
    const { toggleSelected, link } = this.props;
    return toggleSelected(link.id);
  }

  handleAddSelector() {
    const { currentInput } = this.state;

    this.addSelector(currentInput);

    this.setState({ currentInput: '' });
  }

  addSelector(selector) {
    const { link, setAnimationState } = this.props;

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({ page_id: link.id, gray_zone: selector }),
    };

    const endpoint = new URL('/gray_zones/', process.env.REACT_APP_BACKEND_HOST);
    fetch(endpoint.toString(), requestOptions)
      .then((res) => {
        res.text()
          .then(() => this.fetchGrayZones())
          .then(() => this.statusToString('post', res.status));
      });

    setAnimationState(false);
  }

  statusToString(operation, status) {
    const { link, setNotificationMsg } = this.props;

    switch (operation) {
      case 'get':
        if (status === 200) {
          const iframe = document.querySelector(`#html-render-${link.id}`);
          const iframeBody = iframe.contentWindow.document.querySelector('body');

          this.populateFrame(iframe, iframeBody);
        } else if (status === 500) {
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

  fetchGrayZones() {
    const { link, setAnimationState } = this.props;

    console.log('getting identifiers from db');

    const requestOptions = {
      method: 'GET',
    };

    const endpoint = new URL(`/gray_zones/${link.id}`, process.env.REACT_APP_BACKEND_HOST);
    fetch(endpoint.toString(), requestOptions)
      .then((res) => {
        res.text()
          .then((content) => this.setState({ elementIdentifiers: JSON.parse(content) }))
          .then(() => this.statusToString('get', res.status));
      });

    setAnimationState(false);
  }

  deleteSelector(grayZoneId) {
    const { setAnimationState } = this.props;

    const requestOptions = {
      method: 'DELETE',
    };

    const endpoint = new URL(`/gray_zones/${grayZoneId}`, process.env.REACT_APP_BACKEND_HOST);
    fetch(endpoint.toString(), requestOptions)
      .then((res) => {
        res.text()
          .then(() => this.fetchGrayZones())
          .then(() => this.statusToString('delete', res.status));
      });

    setAnimationState(false);
  }

  mouseClick(iframeBody, event) {
    const { divList } = this.state;

    event.stopPropagation();
    event.preventDefault();

    const cssSelector = getCssSelector(event.target, { selectors: ['class', 'id', 'tag', 'nthchild'] });

    const hash = CryptoJS.MD5(cssSelector).toString(CryptoJS.enc.Base64);

    const divId = `selectedDiv-${hash}`;

    let selectedDiv = iframeBody.querySelector(`[id='${divId}']`);

    if (selectedDiv !== null) {
      const { elementIdentifiers } = this.state;

      // Remove div from iframe
      selectedDiv.remove();

      // Remove div from divList
      divList.splice(divList.indexOf(divId), 1);

      const elem = elementIdentifiers.find((element) => {
        const target = iframeBody.querySelector(element.element_selector);
        const targetCssSelector = getCssSelector(target, { selectors: ['class', 'id', 'tag', 'nthchild'] });
        const targetHash = CryptoJS.MD5(targetCssSelector).toString(CryptoJS.enc.Base64);
        const targetDivId = `selectedDiv-${targetHash}`;

        return divId === targetDivId;
      });

      this.deleteSelector(elem.id);
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

      divList.push(divId);

      this.addSelector(cssSelector);
    }
  }

  populateFrame(iframe, iframeBody) {
    const { elementIdentifiers, divList } = this.state;
    const elementsList = [...elementIdentifiers];
    const divListCopy = [...divList];

    for (let i = 0; i < divListCopy.length; i += 1) {
      const element = elementsList.find((auxElement) => {
        const elem = iframe.contentWindow.document.querySelector(auxElement.element_selector);
        const cssSelector = getCssSelector(elem, { selectors: ['class', 'id', 'tag', 'nthchild'] });
        const hash = CryptoJS.MD5(cssSelector).toString(CryptoJS.enc.Base64);
        const divId = `selectedDiv-${hash}`;

        return divListCopy[i] === divId;
      });

      if (element !== undefined) {
        elementsList.splice(elementsList.indexOf(element), 1);
      } else {
        const selectedDiv = iframeBody.querySelector(`[id='${divListCopy[i]}']`);
        selectedDiv.remove();

        divList.splice(divList.indexOf(divListCopy[i]), 1);
      }
    }

    for (let i = 0; i < elementsList.length; i += 1) {
      // This try catch is for handling cases where the 'drawer' is closed just after
      // the page is loaded and it starts adding the events
      // Since the 'drawer' is collapse, there is no page anymore, causing errors
      try {
        const elem = iframe.contentWindow.document.querySelector(elementsList[i].element_selector);
        const cssSelector = getCssSelector(elem, { selectors: ['class', 'id', 'tag', 'nthchild'] });

        const hash = CryptoJS.MD5(cssSelector).toString(CryptoJS.enc.Base64);

        const divId = `selectedDiv-${hash}`;

        const selectedDiv = iframeBody.querySelector(`[id='${divId}']`);

        if (selectedDiv === null) {
          const newSelectedDiv = document.createElement('div');

          const elemDomRect = elem.getBoundingClientRect();
          const bodyDomRect = iframeBody.getBoundingClientRect();

          newSelectedDiv.style.height = `${Math.round(elemDomRect.height)}px`;
          newSelectedDiv.style.width = `${Math.round(elemDomRect.width)}px`;
          newSelectedDiv.style.position = 'absolute';
          newSelectedDiv.style.zIndex = Number.MAX_SAFE_INTEGER;
          newSelectedDiv.style.top = `${Math.round(elemDomRect.top - bodyDomRect.top)}px`;
          newSelectedDiv.style.left = `${Math.round(elemDomRect.left - bodyDomRect.left)}px`;

          newSelectedDiv.style.backgroundColor = 'rgba(148, 148, 148, 0.5)';

          newSelectedDiv.style.pointerEvents = 'none';

          newSelectedDiv.id = `selectedDiv-${hash}`;

          iframeBody.appendChild(newSelectedDiv);

          divList.push(divId);
        }
      } catch (err) {
        console.log(err);
        console.log('Drawer has been closed, aborting element adding');
        return;
      }
    }
  }

  frameInteraction(e) {
    console.log('Adding events');

    const iframe = e.target;
    const iframeBody = iframe.contentWindow.document.querySelector('body');

    setTimeout(() => {
      const { link } = this.props;
      this.populateFrame(iframe, iframeBody);

      iframeBody.addEventListener('mouseover', URLLink.mouseOver.bind(this, iframeBody));
      iframeBody.addEventListener('mouseout', URLLink.mouseOut.bind(this, iframeBody));
      iframeBody.addEventListener('click', this.mouseClick.bind(this, iframeBody), true);

      const spinner = document.querySelector(`#spinner-${link.id}`);
      spinner.classList.add('link-hide');
      iframe.classList.remove('iframe-hide');
    }, 3000);
  }

  toggleExpand() {
    const { link } = this.props;
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
                  this.setState({ extHTML: errorHtml });
                  iframe.classList.remove('iframe-hide');
                } else {
                  const endpointContent = new URL(content[content.length - 1].text_location,
                    process.env.REACT_APP_BACKEND_HOST);
                  fetch(endpointContent)
                    .then((res) => {
                      if (res.status === 200) {
                        res.text()
                          .then((htmlContent) => {
                            iframe.onload = this.frameInteraction;

                            // The following code will identify every link
                            // that starts with a single "/",
                            // which refers to the root of the website,
                            // And add the url before it (so it can actually get the content)
                            const regex = /"\/(?!\/)/gi;
                            const fixedContent = htmlContent.replace(regex, `"${link.url}${(link.url.endsWith('/')) ? '' : '/'}`);

                            this.setState({ extHTML: fixedContent });
                          });
                      } else {
                        spinner.classList.add('link-hide');
                        this.setState({ extHTML: errorHtml });
                        iframe.classList.remove('iframe-hide');
                      }
                    });
                }
              });
          } else {
            spinner.classList.add('link-hide');
            this.setState({ extHTML: errorHtml });
            iframe.classList.remove('iframe-hide');
          }
        });

      divLink.classList.remove('link-hide');
      expandButton.textContent = '∧';
    } else {
      divLink.classList.add('link-hide');

      expandButton.textContent = '∨';

      this.setState({ extHTML: '<h1>Oops, you\'re not supposed to here</h1>' });
    }
  }

  render() {
    const {
      backgroundOn, extHTML, elementIdentifiers, currentInput, showFull,
    } = this.state;
    const { link, setNotificationMsg } = this.props;
    return (
      <>
        <div
          className={`link ${backgroundOn ? 'background-orange-fade' : 'background-orange'}`}
          onMouseEnter={() => this.setState({ showFull: true })}
          onMouseLeave={() => this.setState({ showFull: false })}
        >
          <div className="link url-link">
            <label htmlFor="id-checkbox" className="checkbox-label checkbox path row">
              <input id="id-checkbox" type="checkbox" checked={link.selected} onChange={this.handleUrlSelect} />
              {URLLink.handleUrlSize(link)}
              <svg viewBox="0 0 21 21">
                <path d="M5,10.75 L8.5,14.25 L19.4,2.3 C18.8333333,1.43333333 18.0333333,1 17,1 L4,1 C2.35,1 1,2.35 1,4 L1,17 C1,18.65 2.35,20 4,20 L17,20 C18.65,20 20,18.65 20,17 L20,7.99769186" />
              </svg>
            </label>
            <button type="button" id={`expand-button-${link.id}`} className="expand-button" onClick={this.toggleExpand}>
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
                <input type="text" value={currentInput} onChange={this.handleInputChange} placeholder="Type css selector of element" />
                <button type="button" onClick={this.handleAddSelector}>+</button>
              </div>
              <div className="element-list">
                <ElementSelectorList
                  elementIdentifiers={elementIdentifiers}
                  deleteSelector={this.deleteSelector}
                  setNotificationMsg={setNotificationMsg}
                />
              </div>
            </div>
          </div>
        </div>
        {
          showFull && URLLink.isUrlTooBig(link) && (
            <div className="full-url-box">
              { link.url}
            </div>
          )
        }
      </>
    );
  }
}

URLLink.propTypes = {
  setNotificationMsg: PropTypes.func.isRequired,
  setAnimationState: PropTypes.func.isRequired,
  toggleSelected: PropTypes.func.isRequired,
  link: PropTypes.exact({
    selected: PropTypes.bool,
    id: PropTypes.number.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
};

export default URLLink;
