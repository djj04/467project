"use client"

import { Part } from "@/lib/db"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { far } from '@fortawesome/free-regular-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { useState } from "react"
import { library } from "@fortawesome/fontawesome-svg-core"

type SearchItemProps = {
  onResults: (results: Part[]) => void
}

export default function SearchItem({ onResults }: SearchItemProps) {
  library.add(fas, far)
  
  const [query, setQuery] = useState("")

  const handleSearch = async () => {
    const res = await fetch(`/api/search?query=${encodeURIComponent(query)}`)
    const list: Part[] = await res.json()
    onResults(list)
  }

  return (
    <form onSubmit={(e)=>{e.preventDefault();handleSearch()}}>
      <FontAwesomeIcon icon="magnifying-glass" />
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
