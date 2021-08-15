import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import AuthPage from './pages/Auth';
import AssignPage from './pages/Assign';
import SubjectPage from './pages/Subject';
import MainNavigation from './components/Navigation/MainNavigation';
import AuthContext from './context/auth-context';

import './App.css';

class App extends Component {
  state = {
    token: null,
    studentId: null
  };

  login = (token, studentId, tokenExpiration) => {
    this.setState({ token: token, studentId: studentId });
  };

  logout = () => {
    this.setState({ token: null, studentId: null });
  };

  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <AuthContext.Provider
            value={{
              token: this.state.token,
              studentId: this.state.studentId,
              login: this.login,
              logout: this.logout
            }}
          >
            <MainNavigation />
            <main className="main-content">
              <Switch>
                {this.state.token && <Redirect from="/" to="/subjects" exact />}
                {this.state.token && (
                  <Redirect from="/auth" to="/subjects" exact />
                )}
                {!this.state.token && (
                  <Route path="/auth" component={AuthPage} />
                )}
                <Route path="/subjects" component={SubjectPage} />
                {this.state.token && (
                  <Route path="/assign" component={AssignPage} />
                )}
                {!this.state.token && <Redirect to="/auth" exact />}
              </Switch>
            </main>
          </AuthContext.Provider>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
