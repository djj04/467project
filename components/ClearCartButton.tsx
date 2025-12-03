"use client"

import * as Cart from "@/lib/cart"
import { useRouter } from "next/navigation"
import styles from "./ClearCartButton.module.css"

export default function ClearCartButton() {
	const router = useRouter()
	
	return (
		<button 
		className={styles["clear-cart-button"]}
		onClick={
			()=>{
				Cart.clear()
				router.replace("/cart")
			}
		}>Clear cart</button>
	)
}