import React from 'react';
import { withRouter } from 'react-router';

export class SignupPage extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        name: '',
        email: '', 
        pass: ''
      }
    }
    signUp = async () => {
      await this.props.handleSignup(this.state)
      this.props.history.push('/')
    }
    render() {
      return <div>
        <div>
          <label>Name<input type='text' onChange={(v)=>{
            this.setState({name: v.target.value})
            }}/></label>
        </div>
        <div>
          <label>Email<input type='text' onChange={(v)=>{
            this.setState({email: v.target.value})
            }}/></label>
        </div>
        <div>
          <label>Password<input type='password' onChange={(v)=>this.setState({pass: v.target.value})}/></label>
        </div>
        <button onClick={(e) => this.signUp()}>Sign up</button>
      </div>
    }
  }

export const SignupPageWithRouter = withRouter(SignupPage);