import React from 'react';
import PropTypes from 'prop-types';
import { Accordion, Card, Button } from 'react-bootstrap';
import '../CSS/ComparisonComponents.css';

const CodeComparison = (props) => {
  const { pageName, link, code1 } = props;
  const { name, timeStamp } = code1;
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

          <Accordion defaultActiveKey="0">
            <Card>
              <Card.Header>
                <Accordion.Toggle as={Button} variant="link" eventKey="1">
                  Link ⌄
                </Accordion.Toggle>
              </Card.Header>
              <Accordion.Collapse eventKey="1">
                <Card.Body>{link}</Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>

          <div className="Comparison-Content">
            <img src={name} className="App-logo" alt="logo" />
            <img src="../arrow.png" className="Arrow" alt="logo" />
            <img src={name} className="App-logo" alt="logo" />
          </div>

        </div>

        <div className="TimeStamp">
          <h3>{timeStamp}</h3>
          <h3>{timeStamp}</h3>
        </div>
      </div>
    </>
  );
};

CodeComparison.propTypes = {
  pageName: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  code1: PropTypes.exact({
    name: PropTypes.string.isRequired,
    timeStamp: PropTypes.string.isRequired,
  }).isRequired,
};

export default CodeComparison;
