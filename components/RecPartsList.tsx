"use client"

import { Part } from "@/lib/db"
import RecPartsCard from "./RecPartsCard"
import styles from "./PartsList.module.css"
import SearchItem from "./SearchItem"
import { useState } from "react"

export default function RecPartsList({initialParts}: {initialParts: Part[] | null}) {
    const [parts, setParts] = useState(initialParts)
    
    const handleSearch = (searchResults: Part[]) => {
      setParts(searchResults)
    }
    if (!parts || parts.length <= 0) {
        return (<p>No parts :(</p>)
    }
    return (
        <>
            <SearchItem onResults={handleSearch}/>
            <ul className={styles.items}>
                {parts.map((part: Part)=>(
                    <li key={part.number}>
                        <RecPartsCard
                            part={part}
                        />
                    </li>
                ))}
            </ul>
        </>
    )
}