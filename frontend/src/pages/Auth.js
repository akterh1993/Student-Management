
import React, { Component } from 'react';
import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop'
import './Auth.css';

class AuthPage extends Component{
  state = {
    creating: false,
    students: [],
    isLoading: false,
    selectedStudent: null
  };

  constructor(props) {
    super(props);
    this.nameElRef = React.createRef();
    this.emailElRef = React.createRef();
    this.phonelRef = React.createRef();
    this.dateElRef = React.createRef();
  }

  startcreateStudentHandler = () => {
    this.setState({ creating: true });
  };
  modalConfirmHandler = () => {
    this.setState({ creating: false });
    const name = this.nameElRef.current.value;
    const email = +this.emailElRef.current.value;
    const phone = +this.phoneElRef.current.value;
    const date = this.dateElRef.current.value;
  

    if (
      name.trim().length === 0 ||
      email <= 0 ||
      phone.trim().length === 0 ||
      date.trim().length === 0
    ) {
      return;
    }

    const student = { name, email, phone, date};
    console.log(student);

    const requestBody = {
      query: `
          mutation createStudent($name: String!,$phone: String! $email: String!, $date: String!) {
            createStudent(studentInput: {name: $name, email: $email, date: $date}) {
              _id
              name
              email
              phone
              date
            }
          }
        `,
        variables: {
          name: name,
          email: email,
          phone: phone,
          date: date
        }
    };

    const token = this.context.token;

    fetch('http://localhost:5000/graphql', {
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
          const updatedStudents = [...prevState.students];
          updatedStudents.push({
            _id: resData.data.createStudent._id,
            name: resData.data.createStudent.name,
            email: resData.data.createStudent.email,
            phone: resData.data.createStudent.phone,
            date: resData.data.createStudent.date,
            
            creator: {
              _id: this.context.studentId
            }
          });
          return { students: updatedStudents };
        });
      })
      .catch(err => {
        console.log(err);
      });
  };
  modalCancelHandler = () => {
    this.setState({ creating: false });
  };

    render(){
        return(
          <React.Fragment>
            {this.state.creating && <Backdrop/>}
            {this.state.creating && <Modal name ="Add Student" canCancel canConfirm
             onCancel={this.modalCancelHandler}
             onConfirm={this.modalConfirmHandler}
             confirmText="Confirm">
              <form>
              <div className="form-control">
                <label htmlFor="name">Name</label>
                <input type="text" id="name" ref={this.nameElRef} />
              </div>
              <div className="form-control">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" ref={this.emailElRef} />
              </div>
              <div className="form-control">
                <label htmlFor="phone">Phone</label>
                <input type="Number" id="phone" ref={this.phoneElRef} />
              </div>
              <div className="form-control">
                <label htmlFor="date">Date Of Birth</label>
                <input type="datetime-local" id="date" ref={this.dateElRef} />
              </div>
              <div className="form-control">
                <button
                  className="btn"
                  onClick="#">Subject</button>
              </div>
            </form>
            </Modal>}
            <div className="students-control">
                <button className="btn" onClick={this.startcreateStudentHandler}>Create Student</button>
            </div>
            </React.Fragment>
        );
    }
}
export default AuthPage;
// **************************************************************



// import React, { Component } from 'react';

// import './Auth.css';
// import AuthContext from '../context/auth-context';

// class AuthPage extends Component {
//   state = {
//     isLogin: true
//   };

//   static contextType = AuthContext;

//   constructor(props) {
//     super(props);
//     this.nameEl = React.createRef();
//     this.emailEl = React.createRef();
//     this.passwordEl = React.createRef();
//     this.dateEl = React.createRef();
//   }

//   switchModeHandler = () => {
//     this.setState(prevState => {
//       return { isLogin: !prevState.isLogin };
//     });
//   };

//   submitHandler = subject => {
//     subject.preventDefault();
//     const name = this.emailEl.current.value;
//     const email = this.emailEl.current.value;
//     const password = this.passwordEl.current.value;
//     const date = this.emailEl.current.value;

//     if (name.trim().length === 0 ||
//     email.trim().length === 0 ||
//      password.trim().length === 0||
//      date.trim().length === 0) {
//       return;
//     }

//     let requestBody = {
//       query: `
//         query Login($email: String!, $password: String!) {
//           login(email: $email, password: $password) {
//             studentId
//             token
//             tokenExpiration
//           }
//         }
//       `,
//       variables: {
//         email: email,
//         password: password
//       }
//     };

//     if (!this.state.isLogin) {
//       requestBody = {
//         query: `
//           mutation CreateStudent($name: String!,$email: String!, $password: String!,$date: String!) {
//             createUser(studentInput: {name: $name, email: $email, password: $password, date: $date}) {
//               _id
//               name
//               email
//               date
//             }
//           }
//         `,
//         variables: {
//           name: name,
//           email: email,
//           password: password,
//           date: date,
//         }
//       };
//     }

//     fetch('http://localhost:8000/graphql', {
//       method: 'POST',
//       body: JSON.stringify(requestBody),
//       headers: {
//         'Content-Type': 'application/json'
//       }
//     })
//       .then(res => {
//         if (res.status !== 200 && res.status !== 201) {
//           throw new Error('Failed!');
//         }
//         return res.json();
//       })
//       .then(resData => {
//         if (resData.data.login.token) {
//           this.context.login(
//             resData.data.login.token,
//             resData.data.login.Id,
//             resData.data.login.tokenExpiration
//           );
//         }
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   };

//   render() {
//     return (
//       <form className="auth-form" onSubmit={this.submitHandler}>
//         <div className="form-control">
//           <label htmlFor="name">Name</label>
//           <input type="text" id="name" ref={this.nameEl} />
//         </div>
//         <div className="form-control">
//           <label htmlFor="email">E-Mail</label>
//           <input type="email" id="email" ref={this.emailEl} />
//         </div>
//         <div className="form-control">
//           <label htmlFor="password">Password</label>
//           <input type="password" id="password" ref={this.passwordEl} />
//           <div className="form-control">
//           <label htmlFor="date">Date Of Birth</label>
//           <input type="Date" id="date" ref={this.dateEl} />
//         </div>
//         </div>
//         <div className="form-actions">
//           <button type="submit">Submit</button>
//           <button type="button" onClick={this.switchModeHandler}>
//             Switch to {this.state.isLogin ? 'Signup' : 'Login'}
//           </button>
//         </div>
//       </form>
//     );
//   }
// }

// export default AuthPage;
