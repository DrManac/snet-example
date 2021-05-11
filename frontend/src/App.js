import logo from './logo.svg';
import './App.css';
import React from 'react';
import * as be from './backend'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import {FriendPage} from './pages/friend'
import {UserPage} from './pages/user'
import {LoginPage} from './pages/login'
import { SignupPage, SignupPageWithRouter } from './pages/signup';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {loggedIn: localStorage.getItem('token')}
  }
  handleLogin = async (email, pass) => {
    let token = await be.signIn(email, pass)
    if(token) localStorage.setItem('token', token)
    this.setState({loggedIn: localStorage.getItem('token')})
  }
  handleLogout = () => {
    localStorage.removeItem('token')
    this.setState({loggedIn: localStorage.getItem('token')})
  }
  handleSignup = async (user) => {
    let token = await be.signUp(user)
    if(token) localStorage.setItem('token', token)
    this.setState({loggedIn: localStorage.getItem('token')})
  }
  render() {
    if(!this.state.loggedIn) 
      return <div>
        <Router forceRefresh={true}>
          <Switch>
            <Route exact path="/signup" children={<SignupPageWithRouter handleSignup={this.handleSignup}/>} />
            <Route children={<LoginPage handleLogin={this.handleLogin}/>} />
          </Switch>        
        </Router>
      </div>

    return <div>
        <button onClick={(e) => this.handleLogout()}>Log out</button>
        <Router forceRefresh={true}>
          <Switch>
            <Route exact path="/" children={<UserPage />} />
            <Route path="/:id" children={<FriendPage />} />
          </Switch>        
        </Router>
      </div>
  }
}

export default App;
