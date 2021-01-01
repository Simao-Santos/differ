import React, { Component } from 'react';
import '../CSS/ChangesPage.css';
import Spinner from 'react-bootstrap/Spinner';
import { Pagination } from 'antd';
import CodeComparison from '../Components/CodeComparison';
import 'antd/dist/antd.css';

function groupInformation(response) {
  const test = [];
  for (let i = 0; i < (response.length - 1); i += 1) {
    if (response[i].page_id === response[i + 1].page_id) {
      if (response[i].comp_text_location != null && response[i + 1].comp_text_location != null) {
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
      error: false,
      data: [],
    };

    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    const { page } = this.state;
    const offset = (page - 1) * 20;
    const amount = page * 20;
    const requestOptions = {
      method: 'GET',
    };

    const endpointCount = new URL('/urls/count', process.env.REACT_APP_BACKEND_HOST);
    fetch(endpointCount.toString(), requestOptions)
      .then((res) => {
        if (res.status === 200) {
          res.clone().text().then((content) => (
            this.setState(() => ({
              count: JSON.parse(content).count,
            }))
          ));
        } else if (res.status === 500) {
          this.setState(() => ({ error: true, isLoading: false }));
        }
      });

    const endpointRange = new URL(`/comparisons/range/${offset}/${amount}`, process.env.REACT_APP_BACKEND_HOST);
    fetch(endpointRange.toString(), requestOptions)
      .then((res) => {
        if (res.status === 200) {
          res.clone().text().then((content) => (
            this.setState((prevState) => ({
              isLoading: !prevState.isLoading,
              data: [...prevState.data, groupInformation(JSON.parse(content))],
            }))
          ));
        } else if (res.status === 400 || res.status === 500) {
          this.setState(() => ({ error: true, isLoading: false }));
        }
      });
  }

  onChange(page) {
    this.setState({
      page,
      data: [],
      isLoading: true,
    }, function resetComponent() {
      this.componentDidMount();
    });
  }

  render() {
    const {
      isLoading, data, count, page, error,
    } = this.state;

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
    if (error) {
      return (
        <>
          <div className="centered">
            <h1>Oops, something went wrong...</h1>
            <h1>Try again later!</h1>
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
                pageName={`Page ${ub[0].page_id} with ${Math.round(ub[0].diff_percentage * 10000.0) / 100.0}% different`}
                link={ub[0].url}
                timeStamp1={ub[0].date}
                timeStamp2={ub[1].date}
                comparison={ub[0].comp_text_location}
              />

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
