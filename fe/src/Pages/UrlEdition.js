import React, { useState, useRef, useEffect } from 'react'
import '../CSS/ChangesPage.css'
import '../CSS/URLEdition.css'
import URLList from '../Components/URLList.js'
import Notification from '../Components/Notification'

const LOCAL_STORAGE_KEY = 'differ.links'

function UrlEdition() {

  const [urls, setUrls] = useState([])
  const [file] = useState([])
  const [delete_button_style, setStyle] = useState(["grey", "none", "0.25"]) // delete_button_style[0] => background | delete_button_style[1] => pointerEvents | delete_button_style[2] => opacity
  const [select_all_button, setSelectAll] = useState([false, true]) // select_all_button[0] => message | select_all_button[1] => hidden
  const [be_reply, setBeReply] = useState('{}')
  const [new_urls_json, setJsonUrls] = useState([])
  const urlAddressRef = useRef()


  // useEffects 1. load urls from local storage
  // 2. save new url on local storage 
  useEffect(() => {
      getListOfUrls()

      const selectedUrls = urls.filter(url => url.selected)
      
      if(urls.length > 0){
        if(urls.length === selectedUrls.length){
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


  }, []) 

  useEffect(() => {
    console.log('saved urls')
  }, [urls]) 

  useEffect(() => {
  }, [file])

  useEffect(() => {
    switch(be_reply.type){
      case 'get_urls': setUrls(be_reply.urls)
      break
      case 'post_urls': setUrls(be_reply.urls)
      break
      case 'delete_urls': getListOfUrls()
      break
      case 'error': console.log('ERROR => ' + be_reply.msg)
      break
      default: console.log('Something unexpected has happened');
    }
  }, [be_reply])

  useEffect(() => {
    console.log('json urls update post opt')
    if(new_urls_json.length === 0) return
    console.log('passed conditional')
    const new_urls = JSON.parse(new_urls_json).urls
    setUrls(new_urls)
  }, [new_urls_json])

  // checking/unchecking checkbox
  function toggleSelected(url_id){
    const newUrls = [...urls]
    const url = newUrls.find(url => url.id === url_id)
    url.selected = !url.selected
    setUrls(newUrls)
    
    // once a URL is checked/unchecked update delete button style
    const selectedUrls = newUrls.filter(url => url.selected)
    console.log('there are these many selected => ' + selectedUrls.length)

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
      
      urlAddressRef.current.value = null
      setStyle([" ", " ", " "])

      setSelectAll([true, false])

      const requestDelOptions = {
        method: 'POST',
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify({ url: address })
      }
      fetch("http://localhost:8000/urls", requestDelOptions)
      .then(res => res.text())
      .then(res => setBeReply(JSON.parse(res)))
      
  } 

  // deleting urls
  function handleDeleteUrls() {
    if(window.confirm('You are about to delete all information on ' + urls.filter(url => url.selected).length + ' pages.\nAre you sure you want to proceed?')){
      const selectedUrls = urls.filter(url => url.selected)

      let my_url_ids = []
      for(let i = 0; i < selectedUrls.length; i++){
        my_url_ids[i] = selectedUrls[i].id
      }

      console.log('so in delete there are these many => ' + selectedUrls)

      setStyle(["grey", "none", "0.25"])

      if(selectedUrls.length !== urls.length){
        setSelectAll([true, false])
      } else setSelectAll([false, true])

      const requestOptions = {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify({ url_ids: my_url_ids })
        
      }
      fetch("http://localhost:8000/urls", requestOptions)
      .then(res => res.text())
      .then(res => setBeReply(JSON.parse(res)))

      console.log('delete the mf after this')
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
          toggleSelected(url.id)
        }
      })
    } 
    else {
      urls.forEach(function(url) {
        toggleSelected(url.id)
      })
    }

  }

  function handleRunComparison() {

    const selectedUrls = urls.filter(url => url.selected)

    let my_url_ids = []
    for(let i = 0; i < selectedUrls.length; i++){
      my_url_ids[i] = selectedUrls[i].id
    }

    const requestOptions = {
      method: 'POST',
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify({ url_ids: my_url_ids })
      
    }
    fetch("http://localhost:8000/urls/capture", requestOptions)
    .then(res => res.text())
    .then(res => console.log(res))

  }

  function getListOfUrls() {

    

    console.log('getting urls from db')

    const requestOptions = {
      method: 'GET'
    }

    fetch("http://localhost:8000/urls/", requestOptions)
    .then(res => res.text())
    .then(res => setBeReply(JSON.parse(res)))
  

  }

  

  return (
     <>
      <header>
        <h1> Insert your URL's here!</h1>
        <p>Backend replies: <span class="text-danger">{ be_reply.msg }</span></p>
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
                <button onClick={ handleRunComparison } id="compare-button" style={ { background: delete_button_style[0], pointerEvents: delete_button_style[1], opacity: delete_button_style[2] } }>Run Comparison</button>
              </div>
            </div>    
        </div>
      </div>
     </>
  );
}

export default UrlEdition;