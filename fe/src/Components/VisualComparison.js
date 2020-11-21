import React, { Component } from 'react';
import { Accordion, Card, Button } from 'react-bootstrap';
import '../CSS/ComparisonComponents.css'


class VisualComparison extends Component {
    render() {
        return (
            <>
                <div className="Comparison-Component">
                    <div className="Component-Header">
                        <h2>{this.props.pageName}</h2>
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
                                        <Card.Body>{this.props.link}</Card.Body>
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
                            <img src={this.props.image1} className="View-images" alt="logo" />
                            <img src="../arrow.png" className="Arrow" alt="logo" />
                            <img src={this.props.image2} className="View-images" alt="logo" />
                        </div>

                    </div>

                    <div className="TimeStamp">
                        <h3>{this.props.timeStamp1}</h3>
                        <h3>{this.props.timeStamp2}</h3>
                    </div>
                </div>
            </>
        );
    }

}


export default VisualComparison;
