"use client"
import styles from './PartsListPaginationNav.module.css';

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"

export default function PartsListPaginationNav({pageNumber}: {pageNumber: number}) {
	const pathname = usePathname()
	const searchParams = useSearchParams()
	function hrefForPageNumber(newValue: number) {
		const params = new URLSearchParams(searchParams)
		params.set('page', newValue.toString())
		return `${pathname}?${params.toString()}`
	}
	
	return (
		<div className={styles.pages}>
			{
				pageNumber <= 0 ? null : <Link className={styles.newpage} href={hrefForPageNumber(pageNumber - 1)}>Previous page</Link>
			}
			<Link className={styles.newpage} href={hrefForPageNumber(pageNumber + 1)}>Next page</Link>
		</div>
	)
}