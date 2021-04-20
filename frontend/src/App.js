import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom";

var userId = 'test6@test'


async function loadData(id) {
  let response = await fetch(`http://localhost:3600/users/${id}`)
  return response.json()
}


class UserPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: null,
    };
    loadData(userId).then((data) => {this.setState({userData: data})})
  }
  deleteFriend = async (friendId) => {
    await fetch( `http://localhost:3600/users/${userId}/friends/${friendId}`, {method: 'DELETE'})
    loadData(userId).then((data) => {this.setState({userData: data})})
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

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
  }
  logIn = () => this.props.handleLogin()
  render() {
    return <div>
      <button onClick={(e) => this.logIn()}>Login</button>
    </div>
  }
}

function FriendPage() {
  let { id } = useParams();
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    async function getUserData() {
        const data = await loadData(id);
        setUserData(data);
    }
    getUserData();
  }, [])

  return <div>
    <h1>{userData?.name}</h1>
    <ul>
      {userData?.friends.map(f => <li><Link to={f.email}>{f.name}</Link></li>)}
    </ul>
  </div>
}



class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {loggedIn: false}
  }
  handleLogin = () => {this.setState({loggedIn: true})}
  handleLogout = () => {this.setState({loggedIn: false})}
  render() {
    if(!this.state.loggedIn) 
      return <LoginPage handleLogin={this.handleLogin}/>
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

// function App() {
//   // const [userData, setUserData] = useState({});
//   // useEffect(() => {
//   //   loadData()
//   //   .then(data =>
//   //     setUserData(data)
//   //   );
//   //  }, [])


// }

export default App;
