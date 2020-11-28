import React, { Component } from 'react';
import '../CSS/ChangesPage.css';
import Spinner from 'react-bootstrap/Spinner';
import VisualComparison from '../Components/VisualComparison';

function groupInformation(response) {
  const test = [];
  for (let i = 0; i < (response.length - 1); i += 1) {
    if (response[i].id === response[i + 1].id) {
      test.push([response[i], response[i + 1]]);
      i += 1;
    }
  }

  return test;
}

class VisualChangesPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      data: [],
    };
  }

  componentDidMount() {
    const u = 0;
    const v = 10;
    const requestOptions = {
      method: 'GET',
    };

    fetch(`http://localhost:8000/captures/${u}/${v}`, requestOptions).then((res) => (res.clone().text())).then((res) => (this.setState((prevState) => ({
      isLoading: !prevState.isLoading,
      data: [...prevState.data, groupInformation(JSON.parse(res).captures)],
    }))));
  }

  render() {
    const { isLoading, data } = this.state;
    if (isLoading) {
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
        <div className="Comparison-Cards">
          {
            data[0].map((ub) => (
              <VisualComparison pageName={`Page ${ub[0].id}`} link={ub[0].url} timeStamp1={ub[0].date} timeStamp2={ub[1].date} image1={`http://localhost:8000${ub[0].image_location}`} image2={`http://localhost:8000${ub[1].image_location}`} />
            ))
          }
        </div>
      </>
    );
  }
}

export default VisualChangesPage;
