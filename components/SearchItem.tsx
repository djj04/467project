"use client"

import { Part } from "@/lib/db"
import { useState } from "react"

type SearchItemProps = {
  onResults: (results: Part[]) => void
}

export default function SearchItem({ onResults }: SearchItemProps) {
  const [query, setQuery] = useState("")

  const handleSearch = async () => {
    if (!query) {
      onResults([])
      return
    }
    const res = await fetch(`/api/search?query=${encodeURIComponent(query)}`)
    const list: Part[] = await res.json()
    onResults(list)
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
    </div>
  )
}
