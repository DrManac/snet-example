import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';

async function loadData() {
  var userId = 'test6@test'
  let responce = await fetch(`http://localhost:3600/users/${userId}`)
  return responce.json()
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: null,
    };
    loadData().then((data) => {this.setState({userData: data})})
  }
  render() {
    return (
      <div>
         <h1>{this.state.userData?.name}</h1>
          <input type="button" value='Log out'></input>
          <ul>
            {this.state.userData?.friends.map(f => <li><a href="friend.html">{f.name}</a> <input type="button" value="-"></input></li>)}
          </ul>
          <div id='search'>
              <label>Search <input type="text"></input></label>
              <ul>
                  <li>Res 1 <input type="button" value="+"></input></li>
                  <li>Res 2 <input type="button" value="+"></input></li>
              </ul>
          </div>
      </div>
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
