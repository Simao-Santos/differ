import React, { Component } from 'react';
import URLLink from '../Components/URLLink.js'
import '../CSS/ComparisonComponents.css'


class URLList extends Component {
    render()
    {
        return(
        this.props.urls.map(url => {
            return <URLLink key = {url.id } URLLink = { url } toggleSelected = { this.props.toggleSelected }/>
        })
        );
    }
}

export default URLList;
