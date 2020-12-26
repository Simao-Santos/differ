import React, { useState } from 'react';
import PropTypes from 'prop-types';

export default function ElementSelector({ identifier }) {

    function deleteSelector() {
        const requestOptions = {
            method: 'DELETE',
        };

        const endpoint = new URL(`/grayzones/${ identifier.id }`, process.env.REACT_APP_BACKEND_HOST);
        fetch(endpoint.toString(), requestOptions);
    }

    return (
        <>
            <div className="element-selector-holder">
                <p>{identifier.elementSelector}</p>
                <img src="../trash-icon.png" alt="Remove" onClick={deleteSelector}/>
            </div>
        </>
    );
}

ElementSelector.propTypes = {
    identifier: PropTypes.exact({
      pageId: PropTypes.number.isRequired,
      id: PropTypes.number.isRequired,
      elementSelector: PropTypes.string.isRequired,
    }).isRequired,
  };