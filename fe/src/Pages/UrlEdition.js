import React from 'react';
import '../CSS/HomePage.css';
import '../CSS/URLEdition.css';
import URLList from '../Components/URLList.js';

function UrlEdition() {
  return (
     <>
      <header>
        <h1> Insert your URL's here!</h1>
        <p> Each page will be saved on our database. In the future, all you need to do is run the tests and we will use this version to run the comparisons.</p>
      </header>
      <URLList />
      <form>
        <input type="text" name="url" placeholder="Insert your URL here"></input>
        <button>Add</button>
      </form>
     </>
  );
}

export default UrlEdition;
