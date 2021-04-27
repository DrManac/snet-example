import React, { useState, useEffect } from 'react';
import * as be from '../backend'

import {Link,useParams} from "react-router-dom";
  
export function FriendPage() {
    let { id } = useParams();
    const [userData, setUserData] = useState(null);
    useEffect(() => {
      async function getUserData() {
          const data = await be.getUser(id);
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