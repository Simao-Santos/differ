import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ElementSelector from './ElementSelector';

class ElementSelectorList extends Component {

    render() {
        const { elementIdentifiers } = this.props;
        
        return (
            elementIdentifiers.map((elementIdentifier) => <ElementSelector key={elementIdentifier.id}
                identifier={elementIdentifier} />)
        );
    }
}

ElementSelectorList.propTypes = {
    urls: PropTypes.exact({
        map: PropTypes.func,
    }).isRequired,
};

export default ElementSelectorList;
