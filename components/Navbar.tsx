import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
  return (
    <nav className={styles.nav}>
      <img src="logo.png"/>
      <h1>Welcome to our Product Website!</h1>
      <ul className={styles.menu}>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/cart">Cart</Link>
        </li>
        <li>
          <Link href="/receiving">Receiving</Link>
        </li>
        <li>
          <Link href="/admin">Admin</Link>
        </li>
        <li>
          <Link href="/warehouse">Warehouse</Link>
        </li>
      </ul>
    </nav>
  )
}