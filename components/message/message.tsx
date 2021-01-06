import styles from './message.module.css'
import React from 'react';
import { useContext, useState } from 'react';
import { Context } from '../context';
import { NextPageContext } from 'next';
import axios from 'axios';
import Router from 'next/router';
import { Sender } from '../context';
import { Paper, Button, Container, Grid } from '@material-ui/core';
import MarkunreadMailboxIcon from '@material-ui/icons/MarkunreadMailbox';
// import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

const Message = ({messages}: any) => {
  const [text, setText] = useState('');
  const [avatar, setAvatar] = useState('');
  const [username, setUsername] = useState('');
  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  const global = useContext(Context);

  const increment = () => {
    let next = global.currentMessage + 1;
    if (!global.messages[next]) {
      next = 0;
    }
    global.setCurrentMessage(next);
  }

  const reply = () => {
    global.setDraft({username: username, message:"navigated from search comp"});
    Router.replace('/send');
  }

  React.useEffect(() => {
    const sender: Sender = global.messages[global.currentMessage] || global.messages[0];
    if (sender) {
      setText(sender.text);
      setAvatar(sender.avatar);
      setUsername(sender.username);
      setFirst(sender.first);
      setLast(sender.last);
    } else {
      setText('Welcome to PostCard, this is where you will find any messages you may receive\n ',);
      setAvatar('https://frisbee-images.s3-us-west-1.amazonaws.com/paint.jpg');
      setUsername('WELCOME');
      setFirst('this will be',);
      setLast('the sender\'s info');
    }
  }, [global]);

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justify="center"
    >
      <Paper elevation={8} className={styles.messageContainer}>
        <div className={styles.message}>
          <div className={styles.left}>{text}</div>

          <div className={styles.right}>
            <div className={styles.stamp}>
              <MarkunreadMailboxIcon style={{ fontSize: 40 }} />
            </div>
            <div className={styles.senderInfo}>
              <img className={styles.avatar} src={avatar} />
              <div>
                <div className={styles.username}>@{username}</div>
                <div className={styles.name}>{first} {last}</div>
              </div>
            </div>
          </div>
        </div>
      </Paper>
      <Grid
        justify="center"
      >
        <Button variant="contained" color="secondary" className={styles.button} onClick={reply}>Reply</Button>
        <Button variant="contained" color="primary" style={{ marginLeft: "20px" }} className={styles.button} onClick={increment}>Next</Button>
      </Grid>
    </Grid>
  )
}
export default Message;

