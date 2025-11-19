"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"

export type UpdateQuantityButtonProps = {
	partNumber: number
}

export default function UpdateQuantityButton({partNumber}: UpdateQuantityButtonProps) {
	const [quantityToAdd, changeQuantityToAdd] = useState(0)
	const [isPending, startTransition] = useTransition()
  	const router = useRouter()
	
	async function handleAdd() {
      const res = await fetch("/api/addInventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ partNumber, quantity: quantityToAdd }),
      })
	  
      const data = await res.json()

	  if(data.success){
		// Refresh the server component to show updated quantity
		startTransition(() => router.refresh())
		// Reset input value
		changeQuantityToAdd(0)
		} else {
		alert("Failed to update inventory")
		}
	  }
	
	return (
		<div>
			<button onClick={handleAdd} disabled={isPending || quantityToAdd <= 0}>
        	{isPending ? "Updating..." : "Add To Stock"}
      		</button>
			<label> Incoming Quantity:</label>
			<input
				type="number"
				min="0"
				style={{ width: "50px" }}
				value={quantityToAdd}
				onChange={e=>changeQuantityToAdd(parseInt(e.target.value))}
			/>
		</div>
	)
}