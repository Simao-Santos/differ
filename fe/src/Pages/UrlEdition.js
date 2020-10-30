import React, { useState, useRef, useEffect } from 'react'
import '../CSS/HomePage.css'
import '../CSS/URLEdition.css'
import URLList from '../Components/URLList.js'
import uuidv4 from 'uuid/v4'
import axios from 'axios'

const LOCAL_STORAGE_KEY = 'differ.links'

function UrlEdition() {

  const [urls, setUrls] = useState([])
  const [file, setFile] = useState([])
  const urlAddressRef = useRef()

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

  function toggleSelected(address){ /* to be changed from address to id */
    const newUrls = [...urls]
    const url = newUrls.find(url => url.address === address)
    url.selected = !url.selected
    setUrls(newUrls)
  }

  function handleAddURL(e) {
      const address = urlAddressRef.current.value
      if( address === '') return
      setUrls(prevUrls => {
        return [...prevUrls, {id: uuidv4(), address: address, selected: true}] /* in the future, url's will be added to the DB which auto increments the id */
      })
      urlAddressRef.current.value = null
  } 

  function handleDeleteUrls() {
    const newUrls = urls.filter(url => !url.selected)
    setUrls(newUrls)
  }

  function handleFileUpload() {

    const formData = new FormData();
  
    formData.append("urls", file.selectedFile, file.selectedFile.name)

    console.log(file.selectedFile)

    axios.post("api/uploadfile", formData)


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
                <input type="file" name="file" id="file" hidden></input>                              
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
