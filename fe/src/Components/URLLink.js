import React from 'react'
import '../CSS/URLEdition.css' 

export default function URLLink( { URLLink, toggleSelected }) {

    function handleUrlSelect() {
        return toggleSelected( URLLink.address )
    }

    return (
        <div>
            <label>
                <input type="checkbox" checked={ URLLink.selected } onChange={ handleUrlSelect }/>
                { URLLink.address }
            </label>
        </div>
    )
}
