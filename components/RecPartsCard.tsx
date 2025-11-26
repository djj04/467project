import { Part } from '@/lib/db';
import styles from './PartsCard.module.css';
import UpdateQuantityButton from './UpdateQuantityButton';

type CardProps = {
    part: Part
}

export default function RecPartsCard({part}: CardProps) {
    return (
        <div className={styles.card}>
            <img className={styles.cardimg} src={part.pictureURL} alt={part.description}/>
            <h2 className={styles.name}>Part #{part.number}</h2>
            <p className={styles.desc}>{part.description}</p>
            <div className={styles.priceamtlayout}>
                <p className={styles.price}><b>${part.price}</b></p>
                <p>Stock Quantity: {part.inventoryCount}</p>
            </div>
            <div className={styles.cart}>
                <UpdateQuantityButton partNumber={part.number}/>
            </div>
        </div>
    )
}