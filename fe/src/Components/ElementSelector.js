import React, { useState } from 'react';
import PropTypes from 'prop-types';

export default function ElementSelector({ selector }) {

    console.log('here is the selector => ' + selector)

    return (
        <>
            <div className="element-selector-holder">
                <p>{ selector }</p>
                <img src="../trash-icon.png" alt="Remove" />
            </div>
        </>
    );
}

ElementSelector.propTypes = {
    selector: PropTypes.string.isRequired,
};
