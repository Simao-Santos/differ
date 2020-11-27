import React from 'react';
import ReactDOM from 'react-dom';
import './CSS/index.css';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Tab from 'react-bootstrap/Tab';
import Nav from 'react-bootstrap/Nav';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import VisualChangesPage from './Pages/VisualChangesPage';
import CodeChangesPage from './Pages/CodeChangesPage';
import Layout from './Components/Layout';
import UrlEdition from './Pages/UrlEdition';

function getTab() {
  switch (window.location.pathname.substring(1)) {
    case 'visualChanges':
      return 'second';
    case 'codeChanges':
      return 'third';
    default:
      return 'first';
  }
}

const tabSelected = getTab();

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Layout>
        <Tab.Container id="left-tabs-example" defaultActiveKey={tabSelected}>
          <Row>
            <Col sm={3}>
              <Nav variant="pills" className="flex-column">
                <Nav.Item>
                  <Nav.Link eventKey="first" href="/">URLs</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="second" href="/visualChanges">View</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="third" href="/codeChanges">Code</Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col sm={9}>
              <Tab.Content>
                <Tab.Pane eventKey="first">
                  <Route path="/" exact component={UrlEdition} />
                </Tab.Pane>
                <Tab.Pane eventKey="second">
                  <Route path="/visualChanges" exact component={VisualChangesPage} />
                </Tab.Pane>
                <Tab.Pane eventKey="third">
                  <Route path="/codeChanges" exact component={CodeChangesPage} />
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Layout>
    </Router>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
