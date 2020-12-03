import React from 'react';
import PropTypes from 'prop-types';

import '../CSS/Notification.scss';

export default function Notification({ message, toggleAnimation, animate }) {
  return (
    <div id="pop-up-notification" className={animate ? 'notification hide-opacity' : 'notification'}>
      <button
        id="close-pop-up"
        type="button"
        className="notification_x"
        onClick={() => toggleAnimation(true)}
      >
        x
      </button>
      <p className="notification_message">{message}</p>
    </div>
  );
}

Notification.propTypes = {
  message: PropTypes.string.isRequired,
  toggleAnimation: PropTypes.func.isRequired,
  animate: PropTypes.bool.isRequired,
};
