import React from 'react';
import {Link} from "react-router-dom";
import * as be from '../backend'

export class SearchUsers extends React.Component {
  constructor(props) {
    super(props)
    this.state = {users: []}
  }
  async onChange(query) {
    //console.log(query)
    let users = await be.find(query)
    this.setState({users})
  }
  render() {
    return <div id='search'>
        <label>Search <input type="text" onChange={(e) => this.onChange(e.target.value)}></input></label>
        <ul>
          {this.state.users.map(user => <li>{user.name} <input type="button" value="+" onClick={()=>this.props.addFriend(user._id)}></input></li>)}
        </ul>
    </div>
  }
}

export class UserPage extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        userData: null,
      };
      be.getUser().then((data) => {this.setState({userData: data})})
    }
    deleteFriend = async (friendId) => {
      await be.deleteFriend(this.state.userData.email, friendId)
      be.getUser().then((data) => {this.setState({userData: data})})
    }
    addFriend = async (friendId) => {
      await be.addFriend(this.state.userData.email, friendId)
      be.getUser().then((data) => {this.setState({userData: data})})
    }
    
    render() {
      return <div>
        <h1>{this.state.userData?.name}</h1>
          <ul>
            {this.state.userData?.friends.map((f, i) => 
              <li key={i}>
                <Link to={f.email}>{f.name}</Link>
                <button onClick={(e) => this.deleteFriend(f._id)}>-</button>
              </li>
            )}
          </ul>
          <SearchUsers addFriend={(id) => this.addFriend(id)}/>
      </div>
    }
  }