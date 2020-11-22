import React, { Component } from 'react';
import PropTypes from 'prop-types';
import URLLink from './URLLink';
import '../CSS/ComparisonComponents.css';

class URLList extends Component {
  render() {
    const { urls } = this.props;
    const { toggleSelected } = this.props;
    return (
      urls.map((url) => <URLLink key={url.id} link={url} toggleSelected={toggleSelected} />)
    );
  }
}

URLList.propTypes = {
  toggleSelected: PropTypes.func.isRequired,
  urls: PropTypes.exact({
    map: PropTypes.func,
  }).isRequired,
};

export default URLList;
