import React, { useState, useRef, useEffect } from 'react'
import '../CSS/HomePage.css'
import '../CSS/URLEdition.css'
import URLList from '../Components/URLList.js'
import uuidv4 from 'uuid/v4'

const LOCAL_STORAGE_KEY = 'differ.links'

function UrlEdition() {

  const [urls, setUrls] = useState([])
  const [file, setFile] = useState([])
  const urlAddressRef = useRef()

  // useEffects 1. load urls from local storage
  // 2. save new url on local storage 
  useEffect(() => {
    const storedUrls = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY))
    if (storedUrls) setUrls(storedUrls)
  }, []) 

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(urls))
  }, [urls]) /* whenever a change occurs in 'urls', execute line above */ 

  useEffect(() => {
    //setFile({ selectedFile: e.target.files[0] })
  }, [file])

  // checking/unchecking checkbox
  function toggleSelected(address){ /* to be changed from address to id */
    const newUrls = [...urls]
    const url = newUrls.find(url => url.address === address)
    url.selected = !url.selected
    setUrls(newUrls)
  }

  // adding a new url
  function handleAddURL(e) {
      const address = urlAddressRef.current.value
      if( address === '') return
      var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
                  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
                  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
                  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
                  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
                  '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
      if (! pattern.test(address)) {
        alert('Please insert a valid URL.')
        return
      }
      setUrls(prevUrls => {
        return [...prevUrls, {id: uuidv4(), address: address, selected: true}] /* in the future, url's will be added to the DB which auto increments the id */
      })
      urlAddressRef.current.value = null
  } 

  // deleting urls
  function handleDeleteUrls() {
    const newUrls = urls.filter(url => !url.selected)
    setUrls(newUrls)
  }

  return (
     <>
      <header>
        <h1> Insert your URL's here!</h1>
        <p> Each page will be saved in our database. In the future, all you need to do is run the tests and we will use this version to run the comparisons.</p>
      </header>
      <div class="container">
        <div class="row main-section">
          <div class="left-side col-9">
                <input type="text" ref={ urlAddressRef } placeholder="Insert your URL here"></input>
                <button type = "button" onClick = {handleAddURL} class="next-to-input-button">+</button>
                <input type="file" name="file" id="file" accept=".txt" hidden></input>                              
                <label class="under-input-text" for="file">or <span class="orange-text">submit</span> a file.</label>
                <URLList urls={ urls } toggleSelected={ toggleSelected }/>
            </div>
            <div class="right-side col-3">
              <p>{ urls.filter(url => url.selected).length } URL's selected</p>
              <button type="button" onClick={ handleDeleteUrls }>Delete</button>
            </div>    
        </div>
      </div>
     </>
  );
}

export default UrlEdition;
