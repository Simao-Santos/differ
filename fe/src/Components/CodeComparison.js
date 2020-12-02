import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Accordion, Card, Button } from 'react-bootstrap';
import '../CSS/ComparisonComponents.css';
import Spinner from 'react-bootstrap/Spinner';
import { view } from '../lib/diff';

class CodeComparison extends Component {
  constructor(props) {
    super(props);

    this.props = props;

    this.state = {
      isLoading: true,
      jsonFile: null,
    };
  }

  componentDidMount() {
    const { comparison } = this.props;
    const requestOptions = {
      method: 'GET',
    };
    fetch(`http://localhost:8000${comparison}`, requestOptions)
      .then((res) => (res.clone().text()))
      .then((res) => (this.setState(() => ({
        jsonFile: JSON.parse(res),
        isLoading: false,
      }))));
  }

  render() {
    const {
      pageName, link, timeStamp1, timeStamp2,
    } = this.props;

    const {
      isLoading, jsonFile,
    } = this.state;

    if (isLoading) {
      return (
        <>
          <Spinner animation="border" />
          <h2>
            {pageName}
            {' '}
            is loading... Hang in there!
          </h2>
        </>
      );
    }
    return (

      <>
        <div className="Comparison-Component">
          <div className="Component-Header">
            <h2>{pageName}</h2>
            <Button style={{ float: 'right' }} type="submit" className="btn btn-outline-light">
              Update
            </Button>
          </div>

          <div className="Comparison-Card">

            <Accordion>
              <Card>
                <Card.Header>
                  <Accordion.Toggle as={Button} variant="link" eventKey="0">
                    Link ⌄
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                  <Card.Body>{link}</Card.Body>
                </Accordion.Collapse>
              </Card>

            </Accordion>

            <div className="Comparison-Content">
              <div
                className="Content1"
                dangerouslySetInnerHTML={{
                  __html: view.buildView(jsonFile).outerHTML,
                }}
              />

              <div
                className="Content2"
                dangerouslySetInnerHTML={{
                  __html: view.buildView(jsonFile).outerHTML,
                }}
              />
            </div>

          </div>

          <div className="TimeStamp">
            <h3>{timeStamp1}</h3>
            <h3>{timeStamp2}</h3>
          </div>
        </div>
      </>
    );
  }
}

CodeComparison.propTypes = {
  pageName: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  timeStamp1: PropTypes.string.isRequired,
  timeStamp2: PropTypes.string.isRequired,
  comparison: PropTypes.string.isRequired,
};

export default CodeComparison;
