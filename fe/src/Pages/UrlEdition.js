import React, { useState, useRef, useEffect } from 'react'
import '../CSS/ChangesPage.css'
import '../CSS/URLEdition.css'
import URLList from '../Components/URLList.js'
import uuidv4 from 'uuid/v4'

const LOCAL_STORAGE_KEY = 'differ.links'

function UrlEdition() {

  const [urls, setUrls] = useState([])
  const [file] = useState([])
  const [delete_button_style, setStyle] = useState(["grey", "none", "0.25"]) // delete_button_style[0] => background | delete_button_style[1] => pointerEvents | delete_button_style[2] => opacity
  const [select_all_button, setSelectAll] = useState([false, true]) // select_all_button[0] => message | select_all_button[1] => hidden
  const urlAddressRef = useRef()


  // useEffects 1. load urls from local storage
  // 2. save new url on local storage 
  useEffect(() => {
    const storedUrls = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY))
    if (storedUrls) {

      setUrls(storedUrls)

      //check to see starting state of delete button
      const selectedUrls = storedUrls.filter(url => url.selected)
      
      if(storedUrls.length > 0){
        if(storedUrls.length === selectedUrls.length){
          setSelectAll([false, false])
        }
        else{
          setSelectAll([true, false])
        }
      } else {
        setSelectAll([false, true])
      }
      
      if(selectedUrls.length > 0) {
        
        setStyle([" ", " ", " "]) 
      }    
      else  {
        setStyle(["grey", "none", "0.25"])       
      }
    }
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
    
    // once a URL is checked/unchecked update delete button style
    const selectedUrls = newUrls.filter(url => url.selected)
    
    if(newUrls.length > 0){
      if(newUrls.length === selectedUrls.length){
        setSelectAll([false, false])
      }
      else {
        setSelectAll([true, false])
      }
    } else {
      setSelectAll([false, true])
    }

    if(delete_button_style[0].localeCompare(" ") !== 0){
      if(selectedUrls.length > 0) {

        setStyle([" ", " ", " "]) 
      }
    }
    else  {
      if(selectedUrls.length === 0) {
        setStyle(["grey", "none", "0.25"]) 
      }
    }
  }

  // adding a new url
  function handleAddURL(e) {
      const address = urlAddressRef.current.value
      if( address === '') return
      var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
                  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
                  '((\\d{1,3}\\.){3}\\d{1,3})|localhost)'+ // OR ip (v4) address
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
      setStyle([" ", " ", " "])

      setSelectAll([false, false])
      
  } 

  // deleting urls
  function handleDeleteUrls() {
    if(window.confirm('You are about to delete all information on ' + urls.filter(url => url.selected).length + ' pages.\nAre you sure you want to proceed?')){
      const newUrls = urls.filter(url => !url.selected)
      setUrls(newUrls)

      setStyle(["grey", "none", "0.25"])

      if(newUrls.length > 0){
        setSelectAll([true, false])
      } else setSelectAll([false, true])
    }
  }

  // updating url information
  function handleUpdateUrls() {
    if(window.confirm('You are about to update all information on ' + urls.filter(url => url.selected).length + ' pages.\nAre you sure you want to proceed?')){
      return
    }
  }

  function handleToggleSelectAll() {

    if(select_all_button[0]){
      urls.forEach(function(url) {
        if(!url.selected){
          toggleSelected(url.address)
        }
      })
    } 
    else {
      urls.forEach(function(url) {
        toggleSelected(url.address)
      })
    }

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
                <input type="file" name="file" id="file" accept=".txt" hidden></input><br/>                             
                <label class="under-input-text" for="file">or <span class="orange-text">submit</span> a file.</label><br/><br/>
                <button onClick={ handleToggleSelectAll } hidden={ select_all_button[1] }>{ select_all_button[0] ? 'Select all' : 'Unselect all' }</button>
                <URLList urls={ urls } toggleSelected={ toggleSelected }/>
            </div>
            <div class="right-side col-3">
              <p>{ urls.filter(url => url.selected).length } URL's selected</p>
              <div class="row justify-content-center selection-buttons">
                <button type="button" onClick={ handleDeleteUrls } style={ { background: delete_button_style[0], pointerEvents: delete_button_style[1], opacity: delete_button_style[2] } }>Delete</button>
                <button onClick={ handleUpdateUrls } style={ { background: delete_button_style[0], pointerEvents: delete_button_style[1], opacity: delete_button_style[2] } }>Update</button><br/>
              </div><br/>
              <div class="row justify-content-center selection-buttons">
                <button id="compare-button" style={ { background: delete_button_style[0], pointerEvents: delete_button_style[1], opacity: delete_button_style[2] } }>Run Comparison</button>
              </div>
            </div>    
        </div>
      </div>
     </>
  );
}

export default UrlEdition;