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
            <img className={styles.cardimg} src={image} alt={name}/>
            <h2 className={styles.name}>{name}</h2>
            <p className={styles.desc}>{desc}</p>
            <div className={styles.priceamtlayout}>
                <p>Price: ${price}</p>
                <p>Quantity: {amount}</p>
            </div>
            <div className={styles.cart}>
                <button>Add to Cart</button>
            </div>
        </div>
    )
}