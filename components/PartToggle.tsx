"use client"

import { useState, useEffect } from "react"
import SearchItem from "./SearchItem"
import PartsCard from "./PartsCard"
import PartsListPaginationNav from "./PartsListPaginationNav"
import { Part } from "@/lib/db"
import styles from "./PartsList.module.css"

type ToggleProps = {
  pageNumber: number
}

export default function PartToggle({ pageNumber }: ToggleProps) {
  const [results, setResults] = useState<Part[]>([])
  const [searching, setSearch] = useState(false)
  const [list, setList] = useState<Part[]>([])

  useEffect(() => {
    const getList = async () => {
      const res = await fetch("/api/search?query=&page=" + pageNumber)
      const data: Part[] = await res.json()
      console.log(data, pageNumber)
      setList(data)
    }
    getList()
  }, [pageNumber])

  const handleSearch = (searchResults: Part[]) => {
    setResults(searchResults)
    setSearch(true)
  }

  const showParts = searching ? results : list


  return (
    <>
      <SearchItem onResults={handleSearch} />

      {showParts.length > 0 ? (
        <ul className={styles.items}>
          {showParts.map((part) => (
            <li key={part.number}>
              <PartsCard part={part}/>
            </li>
          ))}
        </ul>
      ) : (
        <p> No parts found</p>
      )}

      {!searching && <PartsListPaginationNav pageNumber={pageNumber}/>}

    </>
  )
}
