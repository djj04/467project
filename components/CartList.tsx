"use client";

import * as Cart from "@/lib/cart"
import CartItem from './CartItem';
import styles from './CartList.module.css';
import { useState, useEffect } from 'react';

export default function CartList(){
    const items = Cart.allItems();
    const [parts, setParts] = useState<Record<number, any[]>>({});
    const [charges, setCharges] = useState(0);

    useEffect(() => {
        if (!items || items.length <= 0) return;

        const numbers = items.map(item => item.number);

        (async () => {
            const data = await (await fetch(`/api/part?ids=[${numbers.join(",")}]`)).json();
            const map: Record<number, any> = {};
            let weightSum = 0;

            data.forEach((part: any) => {
                map[part.number] = [part];
                const quantity = items.find(item => item.number === part.number)?.quantity || 1;
                weightSum += quantity * part.weight;
            });

            setParts(map)

            const result = await fetch("/api/shippingHandlingCharges", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ weightSum })
            })
            const data2 = await result.json();
            setCharges(data2.result);
        })()
    }, []);

    if (!items || items.length <= 0) {
        return (<p>No Items in Cart!</p>)
    }
    
    const itemstotal = items.reduce((sum, item) => {
        const part = parts[item.number]?.[0];
        const price = part?.price ?? 0;
        return sum + price * item.quantity;
    }, 0)

    const total = itemstotal + charges;

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
                    <h2 className={styles.totalprice}>The price of your parts are: ${itemstotal.toFixed(2)}</h2>
                    <h2 className={styles.totalprice}>Shipping and Handling prices: ${charges?.toFixed(2) ?? 0.00}</h2>
                    <h2 className={styles.totalprice}>Total Price: ${total.toFixed(2)}</h2>
                </li>
            </ul>
        </div>
    )
}