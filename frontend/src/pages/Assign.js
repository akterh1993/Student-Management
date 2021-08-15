import React, { Component } from 'react';

import Spinner from '../components/Spinner/Spinner';
import AuthContext from '../context/auth-context';
import AssignList from '../components/Assign/AssignList/AssignList';
import AssignChart from '../components/Assign/AssignChart/AssignChart';
import AssignControl from '../components/Assign/AssignControls/AssignControl';

class AssignPage extends Component {
  state = {
    isLoading: false,
    register: [],
    outputType: 'list'
  };

  static contextType = AuthContext;

  componentDidMount() {
    this.fetchAssign();
  }

  fetchAssign = () => {
    this.setState({ isLoading: true });
    const requestBody = {
      query: `
          query {
            assign {
              _id
             createdAt
             subject {
               _id
               subject
             }
            }
          }
        `
    };

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.context.token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        const assign = resData.data.assign;
        this.setState({ assign: assign, isLoading: false });
      })
      .catch(err => {
        console.log(err);
        this.setState({ isLoading: false });
      });
  };

  deleteAssignHandler = assignId => {
    this.setState({ isLoading: true });
    const requestBody = {
      query: `
          mutation CancelAssignr($id: ID!) {
            cancelAssign(assignId: $id) {
            _id
             subject
            }
          }
        `,
      variables: {
        id: assignId
      }
    };

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.context.token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        
        this.setState(prevState => {
          const updatedAssign = prevState.assign.filter(assign => {
            return assign._id !== assignId;
          });
          return { assign: updatedAssign, isLoading: false };
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({ isLoading: false });
      });
  };

  changeOutputTypeHandler = outputType => {
    if (outputType === 'list') {
      this.setState({ outputType: 'list' });
    } else {
      this.setState({ outputType: 'chart' });
    }
  };

  render() {
    let content = <Spinner />;
    if (!this.state.isLoading) {
      content = (
        <React.Fragment>
          <AssignControl
            activeOutputType={this.state.outputType}
            onChange={this.changeOutputTypeHandler}
          />
          <div>
            {this.state.outputType === 'list' ? (
              <AssignList
                assign={this.state.assign}
                onDelete={this.deleteAssignHandler}
              />
            ) : (
              <AssignChart assign={this.state.assign} />
            )}
          </div>
        </React.Fragment>
      );
    }
    return <React.Fragment>{content}</React.Fragment>;
  }
}

export default AssignPage;
