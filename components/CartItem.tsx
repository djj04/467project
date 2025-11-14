import { Part } from '@/lib/db';
import styles from './PartsCard.module.css';

type CartItemProps = {
    number: number;
    quantity: number;
}

export default async function CartItem({ number, quantity }: CartItemProps) {
    const part = await Part.byNumber(number)

    if (!part) {
        return (<p>Part not Found</p>)
    }

    const totalprice = part.price * quantity;
    
    return (
        <div className={styles.CartItem}>
            <h3>{number}</h3>
            <h3>{part.description}</h3>
            <h3>{quantity}</h3>
            <h3>{totalprice}</h3>
        </div>
    )
}