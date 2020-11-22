import React, { Component } from 'react';
import PropTypes from 'prop-types';
import URLLink from './URLLink';
import '../CSS/ComparisonComponents.css';

class URLList extends Component {
  render() {
    return (
      this.props.urls.map((url) => {
        const { id } = url;
        const { toggleSelected } = this.props;
          <URLLink
            key={id}
            URLLink={url}
            toggleSelected={toggleSelected}
          />;
      })
    );
  }
}

URLList.propTypes = {
  url: PropTypes.exact({
    id: PropTypes.number,
    address: PropTypes.string,
    selected: PropTypes.bool,
  }),
  urls: PropTypes.arrayOf(url),
};

export default URLList;
