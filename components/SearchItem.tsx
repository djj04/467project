"use client"

import { Part } from "@/lib/db"
import { useState } from "react"

type SearchItemProps = {
  onResults: (results: Part[]) => void
}

export default function SearchItem({ onResults }: SearchItemProps) {
  const [query, setQuery] = useState("")

  const handleSearch = async () => {
    const res = await fetch(`/api/search?query=${encodeURIComponent(query)}`)
    const list: Part[] = await res.json()
    onResults(list)
  }

  return (
    <form onSubmit={(e)=>{e.preventDefault();handleSearch()}}>
      <input
        type="text"
        value={query}
        placeholder="Search Part Name or Number"
        onChange={(e) => setQuery(e.target.value)}
      />
      <input type="submit" value="Search"/>
    </form>
  )
}
