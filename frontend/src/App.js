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
  let responce = await fetch(`http://localhost:3600/users/${id}`)
  return responce.json()
}

class UserPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: null,
    };
    loadData(userId).then((data) => {this.setState({userData: data})})
  }
  render() {
    return <div>
      <h1>{this.state.userData?.name}</h1>
        <input type="button" value='Log out'></input>
        <ul>
          {this.state.userData?.friends.map(f => <li><Link to={f.email}>{f.name}</Link> <input type="button" value="-"></input></li>)}
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
  render() {
    return (
      <Router forceRefresh='true'>
        <Switch>
          <Route exact path="/" children={<UserPage />} />
          <Route path="/:id" children={<FriendPage />} />
        </Switch>        
      </Router>
    );
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
