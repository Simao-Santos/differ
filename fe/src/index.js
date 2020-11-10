import React from 'react';
import ReactDOM from 'react-dom';
import './CSS/index.css';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Tab from 'react-bootstrap/Tab';
import Nav from 'react-bootstrap/Nav';
import * as serviceWorker from './serviceWorker';
import VisualChangesPage from './Pages/VisualChangesPage';
import CodeChangesPage from './Pages/CodeChangesPage';
import Layout from './Components/Layout';
import UrlEdition from './Pages/UrlEdition';

ReactDOM.render(
  <React.StrictMode>
    <Layout>
      <Tab.Container id="left-tabs-example" defaultActiveKey="first">
        <Row>
          <Col sm={3}>
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link eventKey="first">URLs</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="second">View</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="third">Code</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col sm={9}>
            <Tab.Content>
              <Tab.Pane eventKey="first">
                <UrlEdition />
              </Tab.Pane>
              <Tab.Pane eventKey="second">
                <VisualChangesPage />
              </Tab.Pane>
              <Tab.Pane eventKey="third">
                <CodeChangesPage />
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Layout>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
