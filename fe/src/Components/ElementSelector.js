import React from 'react';
import PropTypes from 'prop-types';

export default function ElementSelector({ identifier, deleteSelector }) {

    return (
        <>
            <div className="element-selector-holder">
                <p>{identifier.element_selector}</p>
                <img src="../trash-icon.png" alt="Remove" onClick={() => deleteSelector(identifier.id)}/>
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