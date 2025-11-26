import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
  return (
    <nav className={styles.nav}>
      <img src="logo.png" alt="" width="101" height="101"/>
      <h1>Welcome to our Product Website!</h1>
      <ul className={styles.menu}>
        <li>
          <Link href="/"><FontAwesomeIcon icon="house" width="1em" />&nbsp;Home</Link>
        </li>
        <li>
          <Link href="/cart"><FontAwesomeIcon icon="basket-shopping" width="1em" />&nbsp;Cart</Link>
        </li>
        <li>
          <Link href="/receiving"><FontAwesomeIcon icon="warehouse" width="1em" />&nbsp;Receiving</Link>
        </li>
        <li>
          <Link href="/admin"><FontAwesomeIcon icon="person" width="1em" />&nbsp;Admin</Link>
        </li>
        <li>
          <Link href="/warehouse"><FontAwesomeIcon icon="box" width="1em" />&nbsp;Warehouse</Link>
        </li>
      </ul>
    </nav>
  )
}