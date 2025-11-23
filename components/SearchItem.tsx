"use client"

import { useState } from "react"
import PartsCard from "./PartsCard"
import { Part } from "@/lib/db"
import styles from "./PartsCard.module.css"

export default function SearchItem() {
    const [query, setQuery] = useState("")
    const [results, setResults] = useState<Part[]>([])

    const handleSearch = async () => {
        if (!query) {
            setResults([])
            return
        }


        const res = await fetch(`/api/search?query=${encodeURIComponent(query)}`)
        const list = await res.json()
        setResults(list)

    }

    return (
        <div>
            <input
                type="text"
                value={query}
                placeholder="Search Part Name or Number"
                onChange={(e) => setQuery(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>

            <ul className={styles.items}>
                {results.map((part => 
                    <li key={part.number}>
                        <PartsCard part={part} />
                    </li>
                ))}
            </ul>
        </div>
    )
}
