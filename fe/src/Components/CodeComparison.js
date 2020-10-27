import React from 'react';
import { Accordion, Card } from 'react-bootstrap';
import '../CSS/CodeComparison.css'


function CodeComparison(props) {
    return (
            <div className="Code-Component">
                <h2>{props.pageName}</h2>

                <div className="Code-Card">
                    <Accordion defaultActiveKey="0">
                        <Card>
                            <Card.Body>
                                URL IS OVER HERE
                            </Card.Body>
                        </Card>
                    </Accordion>

                    <div className="Code-Content">
                        CODE DIFFERENCES ARE OVER HERE
                    </div>
                </div>
            </div>
    );

}

export default CodeComparison;