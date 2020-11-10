import React, { Component }  from 'react';

import '../CSS/Notification.scss'


export default function Notification( { message } ) {
    return (
        <div class="notification-box">
            <p>{ message }</p>
        </div>
    )
}

