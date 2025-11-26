"use client";

import * as Cart from "@/lib/cart"
import CartItem from './CartItem';
import styles from './CartList.module.css';
import { useState, useEffect } from 'react';

interface Part {
    number: number
    description: string
    price: number
    weight: number
    pictureURL: string
    inventoryCount: number
}

export default function CartList(){
    const items = Cart.allItems();
    const [parts, setParts] = useState<Record<number, Part[]>>({});
    const [charges, setCharges] = useState(0);

    useEffect(() => {
        if (!items || items.length <= 0) return;

        const numbers = items.map(item => item.number);

        (async () => {
            const data = await (await fetch(`/api/part?ids=[${numbers.join(",")}]`)).json();
            const map: Record<number, Part[]> = {};
            let weightSum = 0;

            data.forEach((part: Part) => {
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
        <>
            <table className={styles.list}>
                <thead>
                    <tr className={styles.header}>
                        <th>Part Number: </th>
                        <th>Part Name: </th>
                        <th>Quantity: </th>
                        <th>Subtotal: </th>
                    </tr>
                </thead>
                <tbody>
                    {items.map(item=>(
                        <tr key={item.number}>
                            <CartItem
                                number={item.number}
                                quantity={item.quantity}
                                part={parts[item.number] ?? [{description: "Loading", price: 0}]}
                            />
                        </tr>
                    ))}
                </tbody>
            </table>
            <table>
                <tbody>
                    <tr>
                        <th className={styles.totalprice}>The price of your parts are: </th><td>${itemstotal.toFixed(2)}</td>
                    </tr><tr>
                        <th className={styles.totalprice}>Shipping and Handling charges: </th><td>${charges?.toFixed(2) ?? 0.00}</td>
                    </tr><tr>
                        <th className={styles.totalprice}>Total Price: </th><td>${total.toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>
        </>
    )
}