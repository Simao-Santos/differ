import React, { Component } from 'react';
import PropTypes from 'prop-types';
import URLLink from './URLLink';
import '../CSS/ComparisonComponents.css';

class URLList extends Component {
  render() {
    const { urls } = this.props;
    const { toggleSelected } = this.props;
    const { setNotificationMsg } = this.props;
    const { setAnimationState } = this.props;
    return (
      urls.map((url) => (
        <URLLink
          key={url.id}
          link={url}
          toggleSelected={toggleSelected}
          setNotificationMsg={setNotificationMsg}
          setAnimationState={setAnimationState}
        />
      ))
    );
  }
}

URLList.propTypes = {
  toggleSelected: PropTypes.func.isRequired,
  setNotificationMsg: PropTypes.func.isRequired,
  setAnimationState: PropTypes.func.isRequired,
  urls: PropTypes.exact({
    map: PropTypes.func,
  }).isRequired,
};

export default URLList;
