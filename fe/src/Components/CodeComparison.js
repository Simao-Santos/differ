import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Accordion, Card, Button } from 'react-bootstrap';
import '../CSS/ComparisonComponents.css';
import Spinner from 'react-bootstrap/Spinner';
import { view } from '../lib/diff'

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
    const requestOptions = {
      method: 'GET',
    };
    console.log(this.props.comparison);
    fetch(`http://localhost:8000${this.props.comparison}`, requestOptions)
      .then((res) => (res.clone().text()))
      .then((res) => (this.setState(() => ({
        jsonFile: JSON.parse(res),
        isLoading: false,
      }), () => (console.log(this.state.jsonFile)))));
  }

  render() {
    const {
      pageName, link, timeStamp1, timeStamp2, comparison,
    } = this.props;

    if (this.state.isLoading) {
      return (
        <>
          <div className="centered">
            <Spinner animation="border" />
            <h2>Information is loading... Hang in there!</h2>
          </div>
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
                className="Content"
                dangerouslySetInnerHTML={{
                  __html: view.buildView(this.state.jsonFile).outerHTML
                }}></div>
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
