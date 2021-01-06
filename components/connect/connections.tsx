import axios from 'axios';
import React from 'react';
import { useState, useEffect, useContext } from 'react';
import styles from './connections.module.css'
import { Context } from '../context';
import UserCard from '../cards/userCard';
import RequestCard from '../cards/requestCard';
import { TextField } from '@material-ui/core'


const Connections = () => {
  const global = useContext(Context);
  const [users, setUsers] = useState([]);
  const [searchVal, setSearchVal] = useState('');
  const [requests, setRequests] = useState([]);
  const [friend, setFriend] = useState(false);
  const [myFriends, setMyFriends] = useState([]);
  const [requested, setRequested] = useState([]);

  useEffect(() => {
    if (global.userData.username !== '') {
      getRequestsAndFriends(global.userData.username);
    }
  }, [global.userData.username]);

  const getUsers = async (frs:any) => {
    const resp = await axios({
      url: `${window.location.origin}/api/getUsers`,
      method: 'get',
    });
    const filter = [];
    for (let i = 0; i < resp.data.length; i++) {
      if (!frs[resp.data[i].username]) {
        filter.push(resp.data[i]);
      }
    }
    setUsers(filter);
  };

  const getRequestsAndFriends = async (username: string) => {
    const reqs = await axios({
      url: `${window.location.origin}/api/getFriendRequests`,
      method: 'post',
      data: {
        username: username
      }
    });
    await setRequests(reqs.data);
    const sent = await axios({
      url: `${window.location.origin}/api/getSentRequests`,
      method: 'post',
      data: {
        username: username
      }
    });
    await setRequested(sent.data);
    const fs = await axios({
      url: `${window.location.origin}/api/getFriends`,
      method: 'post',
      data: {
        username: username
      }
    });
    // console.log(fs.data);
    await setMyFriends(fs.data);
    const friendsAndRequests = reqs.data.concat(fs.data, sent.data);
    let obj: any = {};
    for (let i = 0; i < friendsAndRequests.length; i++) {
      obj[friendsAndRequests[i].username] = true;
    }
    getUsers(obj);
  };

  const accept = async (friend: string) => {
    await axios({
      url: `${window.location.origin}/api/acceptFriend`,
      method: 'post',
      data: {
        me: global.userData.username,
        them: friend,
      },
    });
    await getRequestsAndFriends(global.userData.username);
  }

  const ignore = async (friend: string) => {
    await axios({
      url: `${window.location.origin}/api/ignoreRequest`,
      method: 'post',
      data: {
        me: global.userData.username,
        them: friend,
      },
    });
    await getRequestsAndFriends(global.userData.username);
  }

  return (
    <div className={styles.container}>
      <div style={{ marginBottom: "20px", fontSize: "24px" }}>Search Users</div>
      <form style={{ marginBottom: "30px", width: "60vw"}}>
        <TextField
          id="outlined-search"
          label="Search"
          type="search"
          variant="outlined"
          onChange={(e)=>setSearchVal(e.target.value.toLowerCase())}
          autoFocus
          fullWidth
        />
      </form>
      {requests.length > 0 ?
        (<div style={{ borderBottom: "1px solid black", marginBottom: "30px" }}>
          {requests.map((user, i) => {
            for (var key in user) {
              if (key !== 'avatar' && user[key].toLowerCase().includes(searchVal)) {
                return (
                  <RequestCard
                    ignore={ignore}
                    accept={accept}
                    username={user.username}
                    avatar={user.avatar}
                    first={user.first}
                    last={user.last}
                    index={i}
                    sent={false}
                    key={user.username}
                  />
                )
              }
            }
          })}
        </div>) : (<div></div>)}
      <div>
        <div>
          {requested.map((user, i) => {
            if (user.username === global.userData.username) {
              return;
            }
            for (var key in user) {
              if (key !== 'avatar' && user[key].toLowerCase().includes(searchVal)) {
                return (
                  <UserCard
                    key={user.username}
                    username={user.username}
                    avatar={user.avatar}
                    first={user.first}
                    last={user.last}
                    index={i}
                    sent={true}
                  />
                )
              }
            }
          })}
        </div>
        <div>
          {users.map((user, i) => {
            if (user.username === global.userData.username) {
              return;
            }
            for (var key in user) {
              if (key !== 'avatar' && user[key].toLowerCase().includes(searchVal)) {
                return (
                  <UserCard
                    key={user.username}
                    username={user.username}
                    avatar={user.avatar}
                    first={user.first}
                    last={user.last}
                    index={i}
                    sent={false}
                  />
                )
              }
            }
          })}
        </div>
      </div>
    </div>
  )
};

export default Connections;
