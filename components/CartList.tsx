"use client";

import { Cart } from '@/lib/cart';
import CartItem from './CartItem';
import styles from './PartsCard.module.css';

export default function CartList(){
    const items = Cart.allItems();

    if (!items || items.length <= 0) {
        return (<p>No Items in Cart!</p>)
    }
    return (
        <ul className={styles.items}>
            {items.map(item=>(
                <li key={item.number}>
                    <CartItem
                        number={item.number}
                        quantity={item.quantity}
                    />
                </li>
            ))}
        </ul>
    )
}