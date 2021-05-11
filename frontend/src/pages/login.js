import React from 'react';

export class LoginPage extends React.Component {
    constructor(props) {
      super(props);
      this.state = {email: '', pass: ''}
    }
    logIn = () => this.props.handleLogin(this.state.email, this.state.pass)
    render() {
      return <div>
        <div>
          <label>Email<input type='text' onChange={(v)=>{
            this.setState({email: v.target.value})
            }}/></label>
        </div>
        <div>
          <label>Password<input type='password' onChange={(v)=>this.setState({pass: v.target.value})}/></label>
        </div>
        <button onClick={(e) => this.logIn()}>Login</button>
        <a href='/signup'>Sign up</a>
      </div>
    }
  }