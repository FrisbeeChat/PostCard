import styles from './header.module.css'
import { useContext } from 'react';
import Link from 'next/link'
import { Context } from '../context'
import { AppBar, Toolbar, Button, Container} from '@material-ui/core';
import MarkunreadMailboxIcon from '@material-ui/icons/MarkunreadMailbox';

const Header: React.FC = () => {
  const global = useContext(Context);

  return (
    <AppBar className={styles.header}>
      <Container>
      <div className={styles.contWidth}>
        <Link href="/">
          <span id={styles.title}>
            <MarkunreadMailboxIcon />
           <div style={{ marginLeft: "12px" }}>{global.appName}</div>
          </span>
        </Link>
        <Toolbar className={styles.buttonContainer}>
          <Link href="/connect">
            <Button style={{ color: 'white' }}>Connect</Button>
          </Link>
          <Link href="/contacts">
            <Button style={{ color: 'white' }}>Send a message</Button>
          </Link>
          <Link href="/view">
            <Button style={{ color: 'white' }}>See All Messages</Button>
          </Link>
            <img id={styles.avatar} src={global.userData.avatar} /> {/*//use getInitialProps */}
        </Toolbar>
      </div>
      </Container>
    </AppBar>
  )
}

export default Header;