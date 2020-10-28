import React from 'react';
import URLLink from '../Components/URLLink.js'
import '../CSS/VisualComparison.css'


function URLList( { urls, toggleSelected } ) {
    return(
        urls.map(url => {
            return <URLLink key = { url.id } URLLink = { url } toggleSelected = { toggleSelected }/>
        })
    );

}

export default URLList;