import React from 'react';
import { Accordion, Card, Button } from 'react-bootstrap';
import '../CSS/ComparisonComponents.css';
import PropTypes from 'prop-types';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

const VisualComparison = (props) => {
  const {
    pageName, link, image1, image2, timeStamp1, timeStamp2,
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

          <Accordion defaultActiveKey="0">
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
                <Card.Body>Place for image</Card.Body>
              </Accordion.Collapse>
            </Card>

          </Accordion>

          <div className="Comparison-Content">
            <Zoom>
              <img src={image1} className="View-images" alt="logo" />
            </Zoom>
            <img src="../arrow.png" className="Arrow" alt="logo" />
            <Zoom>
              <img src={image2} className="View-images" alt="logo" />
            </Zoom>
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

VisualComparison.propTypes = {
  pageName: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  image1: PropTypes.string.isRequired,
  image2: PropTypes.string.isRequired,
  timeStamp1: PropTypes.string.isRequired,
  timeStamp2: PropTypes.string.isRequired,

};

export default VisualComparison;
