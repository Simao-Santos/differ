import React from 'react';
import { Accordion, Card, Button } from 'react-bootstrap';
import '../CSS/ComparisonComponents.css';

function VisualComparison(props) {
  return (
    <>
      <div className="Comparison-Component">
        <div className="Component-Header">
          <h2>{props.pageName}</h2>
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
                <Card.Body>{props.link}</Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>

          <div className="Comparison-Content">
            <img src={props.image1.name} className="App-logo" alt="logo" />
            <img src="../arrow.png" className="Arrow" alt="logo" />
            <img src={props.image2.name} className="App-logo" alt="logo" />
          </div>

        </div>

        <div className="TimeStamp">
          <h3>{props.image1.timeStamp}</h3>
          <h3>{props.image2.timeStamp}</h3>
        </div>
      </div>
    </>
  );
}

export default VisualComparison;
