import React, { Component } from 'react';

import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import SubjectList from '../components/Subjects/SubjectList/SubjectItem/SubjectItem';
import Spinner from '../components/Spinner/Spinner';
import AuthContext from '../context/auth-context';
import './Subject.css';

class SubjectsPage extends Component {
  state = {
    creating: false,
    subjects: [],
    isLoading: false,
    selectedSubject: null
  };
  isActive = true;

  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.subjectElRef = React.createRef();
  }

  componentDidMount() {
    this.fetchSubjects();
  }

  startCreateSubjectHandler = () => {
    this.setState({ creating: true });
  };

  modalConfirmHandler = () => {
    this.setState({ creating: false });
    const subject = this.subjectElRef.current.value;

    if (
        subject.trim().length === 0
    ) {
      return;
    }

    const sub = { subject };
    console.log(sub);

    const requestBody = {
      query: `
          mutation CreateEvent($subject: String!) {
            createEvent(eventInput: {subject: $subject}) {
              _id
              subject
              
            }
          }
        `,
        variables: {
            subject: subject,

        }
    };

    const token = this.context.token;

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
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
          const updatedSubjects = [...prevState.subjects];
          updatedSubjects.push({
            _id: resData.data.createSubject._id,
            subject: resData.data.createSubject.subject,
            creator: {
              _id: this.context.studentId
            }
          });
          return { subjects: updatedSubjects };
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  modalCancelHandler = () => {
    this.setState({ creating: false, selectedEvent: null });
  };

  fetchEvents() {
    this.setState({ isLoading: true });
    const requestBody = {
      query: `
          query {
            events {
              _id
              subject
              creator {
                _id
                email
              }
            }
          }
        `
    };

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        const subjects = resData.data.events;
        if (this.isActive) {
          this.setState({ subjects: subjects, isLoading: false });
        }
      })
      .catch(err => {
        console.log(err);
        if (this.isActive) {
          this.setState({ isLoading: false });
        }
      });
  }

  showDetailHandler = subjectId => {
    this.setState(prevState => {
      const selectedSUbject = prevState.subjects.find(e => e._id === subjectId);
      return { selectedSUbject: selectedSUbject };
    });
  };

  regSubjectHandler = () => {
    if (!this.context.token) {
      this.setState({ selectedSubject: null });
      return;
    }
    console.log(this.state.selectedSubject)
    const requestBody = {
      query: `
          mutation regSubject($id: ID!) {
            regSubject(subjectId: $id) {
              _id
             createdAt
             updatedAt
            }
          }
        `,
        variables: {
          id: this.state.selectedSubject._id
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
        console.log(resData);
        this.setState({ selectedSubject: null });
      })
      .catch(err => {
        console.log(err);
      });
  };

  componentWillUnmount() {
    this.isActive = false;
  }

  render() {
    return (
      <React.Fragment>
        {(this.state.creating || this.state.selectedSubject) && <Backdrop />}
        {this.state.creating && (
          <Modal
            title="Add Subject"
            canCancel
            canConfirm
            onCancel={this.modalCancelHandler}
            onConfirm={this.modalConfirmHandler}
            confirmText="Confirm"
          >
            <form>
              <div className="form-control">
                <label htmlFor="subject">Title</label>
                <input type="text" id="title" ref={this.subjectElRef} />
              </div>        
            </form>
          </Modal>
        )}
        {this.state.selectedStudent && (
          <Modal
            title={this.state.selectedStudent.title}
            canCancel
            canConfirm
            onCancel={this.modalCancelHandler}
            onConfirm={this.regSubjectHandler}
            confirmText={this.context.token ? 'Register' : 'Confirm'}
          >
            <h1>{this.state.selectedSubject.subject}</h1>
    
          </Modal>
        )}
        {this.context.token && (
          <div className="subjects-control">
            <p>Share your own Subjects!</p>
            <button className="btn" onClick={this.startCreateSubjectHandler}>
              Create Event
            </button>
          </div>
        )}
        {this.state.isLoading ? (
          <Spinner />
        ) : (
          <SubjectList
            events={this.state.subjects}
            authUserId={this.context.studentId}
            onViewDetail={this.showDetailHandler}
          />
        )}
      </React.Fragment>
    );
  }
}

export default SubjectsPage;
