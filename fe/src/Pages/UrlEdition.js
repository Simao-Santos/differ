import React, { useState, useRef, useEffect } from 'react';
import '../CSS/ChangesPage.css';
import '../CSS/URLEdition.css';
import URLList from '../Components/URLList';
import Notification from '../Components/Notification';

function getListOfUrls(setBeReply) {
  console.log('getting urls from db');

  const requestOptions = {
    method: 'GET',
  };

  fetch('http://localhost:8000/urls/', requestOptions)
    .then((res) => {
      res.text()
        .then((content) => setBeReply({ type: 'get_urls', status: res.status, content: JSON.parse(content) }));
    });
}

function UrlEdition() {
  const [urls, setUrls] = useState([]);
  const [file, setFile] = useState(null);
  const [deleteButtonStyle, setStyle] = useState(['grey', 'none', '0.25']);
  // deleteButtonStyle[0] => background
  // deleteButtonStyle[1] => pointerEvents
  // deleteButtonStyle[2] => opacity

  const [selectAllButton, setSelectAll] = useState([false, true]);
  // selectAllButton[0] => message | selectAllButton[1] => hidden

  const [beReply, setBeReply] = useState('{}');
  const [doAnimation, setAnimationState] = useState(true);
  const [notificationMsg, setNotificationMsg] = useState('');
  const urlAddressRef = useRef();

  // useEffects 1. load urls from local storage
  // 2. save new url on local storage
  useEffect(() => {
    getListOfUrls(setBeReply);

    const selectedUrls = urls.filter((url) => url.selected);

    if (urls.length > 0) {
      if (urls.length === selectedUrls.length) {
        setSelectAll([false, false]);
      } else {
        setSelectAll([true, false]);
      }
    } else {
      setSelectAll([false, true]);
    }

    if (selectedUrls.length > 0) {
      setStyle([' ', ' ', ' ']);
    } else {
      setStyle(['grey', 'none', '0.25']);
    }
  }, []);

  useEffect(() => {
    console.log('saved urls');
  }, [urls]);

  useEffect(() => {

  }, [file]);

  useEffect(() => {
  }, [doAnimation]);

  useEffect(() => {
    switch (beReply.type) {
      case 'get_urls':
        if (beReply.status === 200) setUrls(beReply.content);
        else if (beReply.status === 500) setNotificationMsg('Couldn\'t retrieve URLs');
        break;
      case 'post_url':
        if (beReply.status === 200) {
          getListOfUrls(setBeReply);
          setNotificationMsg('URL added');
        } else if (beReply.status === 400) setNotificationMsg('Invalid URL');
        else if (beReply.status === 500) setNotificationMsg('Couldn\'t add URL');
        break;
      case 'delete_url':
        if (beReply.status === 200) {
          getListOfUrls(setBeReply);
          setNotificationMsg('URL deleted');
        } else if (beReply.status === 400 || beReply.status === 404 || beReply.status === 500) setNotificationMsg('Couldn\'t delete URL');
        // TODO: is this message ok for all these status?
        break;
      default: console.log(`Something unexpected has happened => ${beReply.type}`);
    }
  }, [beReply]);

  // checking/unchecking checkbox
  function toggleSelected(urlId) {
    const newUrls = [...urls];
    const url = newUrls.find((urlAux) => urlAux.id === urlId);
    url.selected = !url.selected;
    setUrls(newUrls);

    // once a URL is checked/unchecked update delete button style
    const selectedUrls = newUrls.filter((urlAux) => urlAux.selected);
    console.log(`there are these many selected => ${selectedUrls.length}`);

    if (newUrls.length > 0) {
      if (newUrls.length === selectedUrls.length) {
        setSelectAll([false, false]);
      } else {
        setSelectAll([true, false]);
      }
    } else {
      setSelectAll([false, true]);
    }

    if (deleteButtonStyle[0].localeCompare(' ') !== 0) {
      if (selectedUrls.length > 0) {
        setStyle([' ', ' ', ' ']);
      }
    } else if (selectedUrls.length === 0) {
      setStyle(['grey', 'none', '0.25']);
    }
  }

  // adding a new url via text input
  function handleAddURL() {
    const address = urlAddressRef.current.value;
    if (address === '') return;
    const pattern = new RegExp('^(https?:\\/\\/)?' // protocol
      + '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' // domain name
      + '((\\d{1,3}\\.){3}\\d{1,3})|localhost)' // OR ip (v4) address
      + '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' // port and path
      + '(\\?[;&a-z\\d%_.~+=-]*)?' // query string
      + '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    if (!pattern.test(address)) {
      alert('Please insert a valid URL.');
      return;
    }

    urlAddressRef.current.value = null;
    setStyle([' ', ' ', ' ']);

    setSelectAll([true, false]);

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({ url: address }),
    };
    fetch('http://localhost:8000/urls', requestOptions)
      .then((res) => {
        res.text()
          .then((content) => setBeReply({ type: 'post_url', status: res.status, content: JSON.parse(content) }));
      });

    setAnimationState(false);
  }

  // adding multiple urls via file
  function handleAddURLs(address) {
    if (address === '') return;
    const pattern = new RegExp('^(https?:\\/\\/)?' // protocol
      + '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' // domain name
      + '((\\d{1,3}\\.){3}\\d{1,3})|localhost)' // OR ip (v4) address
      + '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' // port and path
      + '(\\?[;&a-z\\d%_.~+=-]*)?' // query string
      + '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    if (!pattern.test(address)) {
      alert('Please insert a valid URL.');
      return;
    }

    urlAddressRef.current.value = null;
    setStyle([' ', ' ', ' ']);

    setSelectAll([true, false]);

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({ url: address }),
    };
    fetch('http://localhost:8000/urls', requestOptions)
      .then((res) => {
        res.text()
          .then((content) => setBeReply({ type: 'post_url', status: res.status, content: JSON.parse(content) }));
      });

    setAnimationState(false);
  }

  // deleting urls
  function handleDeleteUrls() {
    if (window.confirm(`You are about to delete all information on ${urls.filter((url) => url.selected).length} pages.\nAre you sure you want to proceed?`)) {
      const selectedUrls = urls.filter((url) => url.selected);

      const myUrlIds = [];
      for (let i = 0; i < selectedUrls.length; i += 1) {
        myUrlIds[i] = selectedUrls[i].id;
      }

      console.log(`so in delete there are these many => ${selectedUrls}`);

      setStyle(['grey', 'none', '0.25']);

      if (selectedUrls.length !== urls.length) {
        setSelectAll([true, false]);
      } else setSelectAll([false, true]);

      const requestOptions = {
        method: 'DELETE',
      };

      myUrlIds.forEach((id) => fetch(`http://localhost:8000/urls/${id}`, requestOptions)
        .then((res) => {
          res.text()
            .then((content) => setBeReply({ type: 'delete_url', status: res.status, content: JSON.parse(content) }));
        }));

      setAnimationState(false);
    }
  }

  // updating url information
  function handleUpdateUrls() {
    if (window.confirm(`You are about to update all information on ${urls.filter((url) => url.selected).length} pages.\nAre you sure you want to proceed?`)) {
      const selectedUrls = urls.filter((url) => url.selected);

      const myUrlIds = [];
      for (let i = 0; i < selectedUrls.length; i += 1) {
        myUrlIds[i] = selectedUrls[i].id;
      }

      const requestOptions = {
        method: 'GET',

      };

      myUrlIds.forEach((id) => fetch(`http://localhost:8000/actions/capture/${id}`, requestOptions)
        .then((res) => {
          if (res.status === 200) {
            console.log(`Capture for id ${id} has started`);
          } else if (res.status === 400 || res.status === 404 || res.status === 500) {
            // TODO: show error message? None of these situations is due to user error
          }
        }));

      setAnimationState(false);
    }
  }

  function handleToggleSelectAll() {
    if (selectAllButton[0]) {
      urls.forEach((url) => {
        if (!url.selected) {
          toggleSelected(url.id);
        }
      });
    } else {
      urls.forEach((url) => {
        toggleSelected(url.id);
      });
    }
  }

  function handleRunComparison() {
    const selectedUrls = urls.filter((url) => url.selected);

    const myUrlIds = [];
    for (let i = 0; i < selectedUrls.length; i += 1) {
      myUrlIds[i] = selectedUrls[i].id;
    }

    const requestOptions = {
      method: 'GET',
    };

    myUrlIds.forEach((id) => fetch(`http://localhost:8000/actions/compare/${id}`, requestOptions)
      .then((res) => {
        if (res.status === 200) {
          console.log(`Comparison for id ${id} has started`);
        } else if (res.status === 412) {
          console.log(`Comparison for id ${id} has not started because there is no older capture for this URL`);
          // TODO: show error message for this situation?
        } else if (res.status === 400 || res.status === 404 || res.status === 500) {
          // TODO: show error message? None of these situations is due to user error
        }
      }));

    setAnimationState(false);
  }

  function handleResetFile() {
    console.log('File has been reset.');
    setFile(null);
  }

  function handleAddMultipleUrls() {
    if (file !== null) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const lines = e.target.result.split('\n');
        for (let line = 0; line < lines.length; line += 1) {
          if (lines[line].length > 0) {
            handleAddURLs(lines[line]);
          }
        }
      };
      reader.readAsText(file.file);

      setFile(null);
    }
  }

  return (
    <>
      <header>
        <Notification
          message={notificationMsg}
          toggleAnimation={setAnimationState}
          animate={doAnimation}
        />
        <h1> Insert your URL&apos;s here!</h1>
        <p>
          {' '}
          Each page will be saved in our database. In the future, all you need to do is
          run the tests and we will use this version to run the comparisons.
        </p>
      </header>
      <div className="container">
        <div className="row main-section">
          <div className="left-side col-9">
            <input type="text" ref={urlAddressRef} placeholder="Insert your URL here" />
            <button type="button" onClick={handleAddURL} className="next-to-input-button">+</button>
            <input type="file" name="file" id="file" accept=".txt" onChange={(e) => setFile({ file: e.target.files[0] })} hidden />
            <br />

            <div className="row">
              <label className="under-input-text" htmlFor="file">
                or
                <span className="orange-text">submit</span>
                {' '}
                a file.
              </label>
              <br />
              <br />
              <div hidden={file === null}>
                <span className="submit-file-question">Submit urls?</span>
                <span
                  className="submit-file-options"
                  id="yes-submit"
                  tabIndex="0"
                  role="button"
                  onClick={handleAddMultipleUrls}
                  onKeyPress={handleAddMultipleUrls}
                >
                  Yes
                </span>
                <span
                  className="submit-file-options"
                  id="no-submit"
                  tabIndex="0"
                  role="button"
                  onClick={handleResetFile}
                  onKeyPress={handleResetFile}
                >
                  No
                </span>
              </div>
            </div>

            <button onClick={handleToggleSelectAll} type="button" hidden={selectAllButton[1]}>{selectAllButton[0] ? 'Select all' : 'Unselect all'}</button>
            <URLList urls={urls} toggleSelected={toggleSelected} />
          </div>
          <div className="right-side col-3">
            <p>
              {urls.filter((url) => url.selected).length}
              {' '}
              URL&apos;s selected
            </p>
            <div className="row justify-content-center selection-buttons">
              <button type="button" onClick={handleDeleteUrls} style={{ background: deleteButtonStyle[0], pointerEvents: deleteButtonStyle[1], opacity: deleteButtonStyle[2] }}>Delete</button>
              <button
                onClick={handleUpdateUrls}
                type="button"
                style={{
                  background: deleteButtonStyle[0],
                  pointerEvents: deleteButtonStyle[1],
                  opacity: deleteButtonStyle[2],
                }}
              >
                Update
              </button>
              <br />
            </div>
            <br />
            <div className="row justify-content-center selection-buttons">
              <button onClick={handleRunComparison} type="button" id="compare-button" style={{ background: deleteButtonStyle[0], pointerEvents: deleteButtonStyle[1], opacity: deleteButtonStyle[2] }}>Run Comparison</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UrlEdition;
