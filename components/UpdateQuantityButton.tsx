"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import styles from "./UpdateQuantityButton.module.css"

export type UpdateQuantityButtonProps = {
	partNumber: number
	inStockQuantity: number
}

export default function UpdateQuantityButton({ partNumber, inStockQuantity }: UpdateQuantityButtonProps) {
	const [quantityToAdd, changeQuantityToAdd] = useState<string>("")
	const [isPending, startTransition] = useTransition()
	const [hasBeenAdded, setHasBeenAdded] = useState(false)
	const router = useRouter()

	async function handleUpdate() {
		const quantity = parseInt(quantityToAdd, 10)
		if (isNaN(quantity) || quantity === 0) return

		const apiRoute = quantity >= 0 ? "/api/addInventory" : "/api/removeInventory"

		const res = await fetch(apiRoute, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				partNumber,
				quantity: Math.abs(quantity),
			}),
		})

		const data = await res.json()

		if (data.success) {
			startTransition(() => router.refresh())
			changeQuantityToAdd("")
		} else {
			alert("Failed to update inventory")
		}

		setHasBeenAdded(true)
		setTimeout(() => setHasBeenAdded(false), 2000)
	}

	const numericValue = parseInt(quantityToAdd, 10)
	const disabled =
		isPending ||
		isNaN(numericValue) ||
		numericValue === 0 ||
		numericValue < -inStockQuantity

	return (
		<div>
			<div>
				<p className={styles.quantityText}>
					{hasBeenAdded ? "Quantity Changed!" : "\u00A0"}
				</p>
			</div>

			<button onClick={handleUpdate} disabled={disabled}>
				{isPending ? "Updating..." : "Update Stock"}
			</button>

			<label> Quantity Change: </label>
			<input
				type="number"
				min={-inStockQuantity}
				style={{ width: "60px" }}
				value={quantityToAdd}
				onChange={(e) => changeQuantityToAdd(e.target.value)}
			/>
		</div>
	)
}