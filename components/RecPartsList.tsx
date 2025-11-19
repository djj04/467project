import { Part } from "@/lib/db"
import RecPartsCard from "./RecPartsCard"
import styles from "./PartsList.module.css"

export default async function RecPartsList({pageNumber}: {pageNumber: number}) {
    const parts = await Part.list(pageNumber)
    if (!parts || parts.length <= 0) {
        return (<p>No parts :(</p>)
    }
    return (
        <ul className={styles.items}>
            {parts.map(part=>(
                <li key={part.number}>
                    <RecPartsCard
                        part={part}
                    />
                </li>
            ))}
        </ul>
    )
}