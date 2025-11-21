import styles from './CartItem.module.css';

type CartItemProps = {
    number: number;
    quantity: number;
    part: { description: string; price: number}[];
}

export default function CartItem({ number, quantity, part }: CartItemProps) {

    return (
        <div className={styles.CartItem}>
            <h3>{number}</h3>
            <h3>{part[0]?.description}</h3>
            <h3>{quantity}</h3>
            <h3>${((part[0]?.price || 0) * (quantity || 0)).toFixed(2)}</h3>
        </div>
    )
}