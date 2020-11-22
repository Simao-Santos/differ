import React, { useState } from 'react';

import '../CSS/Notification.scss';

export default function Notification({ message, toggleAnimation, animate }) {
  return (
    <div id="pop-up-notification" className={animate ? 'notification hide-opacity' : 'notification'}>
      <a id="close-pop-up" className="notification_x" onClick={function () { toggleAnimation(true); }}>x</a>
      <p className="notification_message">{message}</p>
    </div>
  );
}
