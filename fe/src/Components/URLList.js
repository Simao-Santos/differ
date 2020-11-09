import React, { Component } from 'react';
import URLLink from '../Components/URLLink.js'
import '../CSS/ComparisonComponents.css'


class URLList extends Component{
    renders() {
        return(
        this.props.urls.map(url => {
            return <URLLink key = { this.props.url.id } URLLink = { this.props.url } toggleSelected = { this.props.toggleSelected }/>
        })
    );
    }

}


export default URLList;