import React, { Component } from 'react';
import '../CSS/ChangesPage.css';
import Spinner from 'react-bootstrap/Spinner';
import { Pagination } from 'antd';
import VisualComparison from '../Components/VisualComparison';
import 'antd/dist/antd.css';

function groupInformation(response) {
  const test = [];
  for (let i = 0; i < (response.length - 1); i += 1) {
    if (response[i].page_id === response[i + 1].page_id) {
      if (response[i].comp_capt_id_1 === response[i + 1].comp_capt_id_1) {
        if (response[i].comp_capt_id_2 < response[i + 1].comp_capt_id_2) {
          response[i].comp_image_location = response[i + 1].comp_image_location;
        }
      } else if (response[i].comp_capt_id_1 < response[i + 1].comp_capt_id_1) {
        response[i].comp_image_location = response[i + 1].comp_image_location;
      } else response[i + 1].comp_image_location = response[i].comp_image_location;
      if (response[i].date > response[i + 1].date) {
        test.push([response[i + 1], response[i]]);
      } else test.push([response[i], response[i + 1]]);
      i += 1;
    }
  }

  return test;
}

class VisualChangesPage extends Component {
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
    const { page, data } = this.state;
    const u = (page - 1) * 20;
    const v = page * 20;
    const requestOptions = {
      method: 'GET',
    };
    console.log(data);
    fetch(`${process.env.REACT_APP_BACKEND_HOST}/urls/count`, requestOptions)
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
    fetch(`${process.env.REACT_APP_BACKEND_HOST}/comparisons/range/${u}/${v}`, requestOptions).then((res) => {
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
              <VisualComparison pageName={`Page ${ub[0].page_id}`} link={ub[0].url} timeStamp1={ub[0].date} timeStamp2={ub[1].date} image1={`${process.env.REACT_APP_BACKEND_HOST}${ub[0].capt_image_location}`} image2={`${process.env.REACT_APP_BACKEND_HOST}${ub[1].capt_image_location}`} comparison={`${process.env.REACT_APP_BACKEND_HOST}${ub[0].comp_image_location}`} />
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

export default VisualChangesPage;
