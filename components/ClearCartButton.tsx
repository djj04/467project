"use client"

import * as Cart from "@/lib/cart"
import { useRouter } from "next/navigation"
export default function ClearCartButton() {
	const router = useRouter()
	
	return (
		<button onClick={
			()=>{
				Cart.clear()
				router.replace("/cart")
			}
		}>Clear cart</button>
	)
}