import styles from './PartsCard.module.css';

type CardProps = {
    name: string;
    desc: string;
    image: string;
    price: number;
    amount: number;
}

export default function PartsCard({name, desc, image, price, amount}: CardProps) {
    return (
        <div className={styles.card}>
            
        </div>
    )
}