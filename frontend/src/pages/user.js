import React from 'react';
import {Link} from "react-router-dom";
import * as be from '../backend'

var userId = 'test6@test'

export class UserPage extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        userData: null,
      };
      be.getUser(userId).then((data) => {this.setState({userData: data})})
    }
    deleteFriend = async (friendId) => {
      be.deleteFriend(userId, friendId)
      be.getUser(userId).then((data) => {this.setState({userData: data})})
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
          <div id='search'>
              <label>Search <input type="text"></input></label>
              <ul>
                  <li>Res 1 <input type="button" value="+"></input></li>
                  <li>Res 2 <input type="button" value="+"></input></li>
              </ul>
          </div>
      </div>
    }
  }