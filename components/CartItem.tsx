import styles from './PartsCard.module.css';
import { useEffect, useState } from 'react';

type CartItemProps = {
    number: number;
    quantity: number;
}


export default function CartItem({ number, quantity }: CartItemProps) {
    const [part, setPart] = useState<any>({description: "Loading", price: 0});

    useEffect(() => {
        (async () => {
            const data = await (await fetch(`/api/part?ids=[${number}]`)).json()
            setPart(data)
        })()
    }, []);
    
    return (
        <div className={styles.CartItem}>
            <h3>{number}</h3>
            <h3>{part[0]?.description}</h3>
            <h3>{quantity}</h3>
            <h3>{part[0]?.price * quantity}</h3>
        </div>
    )
}