import React, { Component } from 'react';
import '../CSS/ChangesPage.css';
import Spinner from 'react-bootstrap/Spinner';
import { Pagination } from 'antd';
import CodeComparison from '../Components/CodeComparison';
import 'antd/dist/antd.css';

function groupInformation(response) {
  const test = [];
  for (let i = 0; i < (response.length - 1); i += 1) {
    if (response[i].id === response[i + 1].id) {
      if (response[i].complocation != null && response[i+1].complocation != null ){
        if (response[i].date > response[i + 1].date) {
          test.push([response[i + 1], response[i]]);
        } else test.push([response[i], response[i + 1]]);  
      }
      i += 1;
    }
  }

  return test;
}

class CodeChangesPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      count: 0,
      page: 1,
      isLoading: true,
      data: [],
    };
  }

  componentDidMount() {
    const { page, data } = this.state;
    console.log(page);
    const u = (page - 1) * 20;
    const v = page * 20;
    const requestOptions = {
      method: 'GET',
    };
    console.log(data);
    fetch(`http://localhost:8000/captures/count`, requestOptions).then((res) => (res.clone().text())).then((res) => (this.setState(() => ({
      count: parseInt(JSON.parse(res).captures[0].count, 10),
    }))));
    fetch(`http://localhost:8000/comparisons/comparisonRange/${u}/${v}`, requestOptions).then((res) => (res.clone().text())).then((res) => (this.setState((prevState) => ({
      isLoading: !prevState.isLoading,
      data: [...prevState.data, groupInformation(JSON.parse(res).captures)],
    }))));
  }

  onChange = page => {
    console.log(page);
    this.setState({
      page,
      data: [],
      isLoading: true,
    }, function () {
      console.log('set state completed', this.state);
      this.componentDidMount();
    });
  }

  render() {
    const {
      isLoading, data, count, page,
    } = this.state;
    console.log(data);
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
              <CodeComparison
                pageName={`Page ${ub[0].id}`} 
                link={ub[0].url}
                timeStamp1={ub[0].date}
                timeStamp2={ub[1].date}
                comparison={ub[0].complocation}
                >
              </CodeComparison>
             
            ))
          }
          <Pagination
            total={count}
            current={page}
            onChange={this.onChange}
          />
        </div>

      </>
    );
  }
}

export default CodeChangesPage;
