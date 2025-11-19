"use client";

import { Cart } from '@/lib/cart';
import CartItem from './CartItem';
import { setDecimals } from './CartItem';
import styles from './CartList.module.css';
import { useState, useEffect } from 'react';

export default function CartList(){
    const items = Cart.allItems();
    const [parts, setParts] = useState<Record<number, any[]>>({});

    useEffect(() => {
        if (!items || items.length <= 0) return;

        const numbers = items.map(item => item.number);

        (async () => {
            const data = await (await fetch(`/api/part?ids=[${numbers.join(",")}]`)).json();
            const map: Record<number, any> = {};

            data.forEach((part: any) => {
                map[part.number] = [part];
            });

            setParts(map)
        })()
    }, []);

    if (!items || items.length <= 0) {
        return (<p>No Items in Cart!</p>)
    }
    
    const total = items.reduce((sum, item) => {
        const part = parts[item.number]?.[0];
        const price = part?.price ?? 0;
        return sum + price * item.quantity;
    }, 0)

    return (
        <div className={styles.list}>
            <ul className={styles.header}>
                <h3>Part Number: </h3>
                <h3>Part Name: </h3>
                <h3>Quantity: </h3>
                <h3>Subtotal: </h3>
            </ul>
            <ul className={styles.items}>
                {items.map(item=>(
                    <li key={item.number}>
                        <CartItem
                            number={item.number}
                            quantity={item.quantity}
                            part={parts[item.number] ?? [{description: "Loading", price: 0}]}
                        />
                    </li>
                ))}
                <li>
                    <h2 className={styles.totalprice}>Your Total Price is: ${setDecimals(total)}</h2>
                </li>
            </ul>
        </div>
    )
}