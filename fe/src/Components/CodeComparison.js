import React from 'react';
import PropTypes from 'prop-types';
import { Accordion, Card, Button } from 'react-bootstrap';
import '../CSS/ComparisonComponents.css';

const CodeComparison = (props) => {
  const {
    pageName, link, image1, image2, timeStamp1, timeStamp2, comparison,
  } = props;
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
            <Card>
              <Card.Header>
                <Accordion.Toggle as={Button} variant="link" eventKey="1">
                  See Differences ⌄
                </Accordion.Toggle>
              </Card.Header>
              <Accordion.Collapse eventKey="1">
                <Card.Body>
                  <h2>{comparison}</h2>
                </Card.Body>
              </Accordion.Collapse>
            </Card>

          </Accordion>

          <div className="Comparison-Content">
            <h2>{image1}</h2>
            <img src="../arrow.png" className="Arrow" alt="logo" />
            <h2>{image2}</h2>
          </div>

        </div>

        <div className="TimeStamp">
          <h3>{timeStamp1}</h3>
          <h3>{timeStamp2}</h3>
        </div>
      </div>
    </>
  );
};

CodeComparison.propTypes = {
  pageName: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  image1: PropTypes.string.isRequired,
  image2: PropTypes.string.isRequired,
  timeStamp1: PropTypes.string.isRequired,
  timeStamp2: PropTypes.string.isRequired,
  comparison: PropTypes.string.isRequired,
};

export default CodeComparison;
