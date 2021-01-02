import React from 'react';
import PropTypes from 'prop-types';

export default function ElementSelector({ identifier, deleteSelector }) {
  return (
    <>
      <div className="element-selector-holder">
        <p>{identifier.element_selector}</p>
        <button type="button" onClick={() => deleteSelector(identifier.id)} className="trash-button">
          <img src="../trash-icon.png" alt="Remove" />
        </button>
      </div>
    </>
  );
}

ElementSelector.propTypes = {
  deleteSelector: PropTypes.func.isRequired,
  identifier: PropTypes.exact({
    id: PropTypes.number.isRequired,
    page_id: PropTypes.number.isRequired,
    element_selector: PropTypes.string.isRequired,
  }).isRequired,
};
