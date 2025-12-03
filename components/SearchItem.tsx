/*"use client"

import { Part } from "@/lib/db"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { far } from '@fortawesome/free-regular-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { useState } from "react"
import { library } from "@fortawesome/fontawesome-svg-core"
import styles from './SearchItem.module.css';

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
    <form 
      className={styles.itemForm}
      onSubmit={(e)=>{e.preventDefault();handleSearch()}}>
      <FontAwesomeIcon className={styles.myIcon} icon="magnifying-glass" />
      <input className={styles.searchInput}
        type="text"
        value={query}
        placeholder="Search Part Name or Number"
        onChange={(e) => setQuery(e.target.value)}
      />
      <input className={styles.submitButton} type="submit" value="Search"/>
    </form>
  )
}*/

"use client";

import { Part } from "@/lib/db";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import styles from "./SearchItem.module.css";

type SearchItemProps = {
  onResults: (results: Part[]) => void;
};

export default function SearchItem({ onResults }: SearchItemProps) {
  library.add(fas, far);

  const [query, setQuery] = useState("");

  const handleSearch = async () => {
    const res = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
    const list: Part[] = await res.json();
    onResults(list);
  };

  const handleClear = async () => {
    setQuery("");
    // Fetch all parts again
    const res = await fetch(`/api/search?query=`);
    const list: Part[] = await res.json();
    onResults(list);
  };

  return (

    <form 
      className={styles.itemForm}
      onSubmit={(e)=>{e.preventDefault(); handleSearch() }}
    >
      <FontAwesomeIcon className={styles.myIcon} icon="magnifying-glass" />

      <div className={styles.inputWrapper}>
        <input 
          className={styles.searchInput}
          type="text"
          value={query}
          placeholder="Search Part Name or Number"
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button 
            type="button" 
            className={styles.clearButton}
            onClick={handleClear}
          >
            ×
          </button>
        )}
      </div>

      <input className={styles.submitButton} type="submit" value="Search" />
    </form>

  );
}

