import React, { useState } from 'react'
import '../CSS/URLEdition.css' 
import '../CSS/PrettyChecks.scss'

export default function URLLink( { URLLink, toggleSelected }) {

    let backgroundOn = URLLink.selected;

    const [showFull, setShowFull] = useState(false)

    function handleUrlSelect() {
        return toggleSelected( URLLink.address )
    }

    function handleUrlSize(URLLink) {
        if(isUrlTooBig(URLLink)){
            return URLLink.address.substring(0, 70) + " (...)" 
        }
        else{
            return URLLink.address
        }
    }

    function isUrlTooBig(URLLink){
        if(URLLink.address.length > 80){
            return true
        }
        else{
            return false
        }
    }

    return (
        <>
            <div class="link" 
                className={`link ${backgroundOn ? 'background-orange-fade' : 'background-orange'}`} 
                onMouseEnter={() => setShowFull(true)}
                onMouseLeave={() => setShowFull(false)}>
                <label class="checkbox path row">
                    <input type="checkbox" checked={ URLLink.selected } onChange={ handleUrlSelect }/>
                    { handleUrlSize(URLLink) }
                    <svg viewBox="0 0 21 21">
                        <path d="M5,10.75 L8.5,14.25 L19.4,2.3 C18.8333333,1.43333333 18.0333333,1 17,1 L4,1 C2.35,1 1,2.35 1,4 L1,17 C1,18.65 2.35,20 4,20 L17,20 C18.65,20 20,18.65 20,17 L20,7.99769186"></path>
                    </svg>                
                </label>
            </div>
            {
                showFull && isUrlTooBig(URLLink) && (
                    <div class="full-url-box">
                        { URLLink.address }
                    </div>
                )
            }
        </>
    )
}
