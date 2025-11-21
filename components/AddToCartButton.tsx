"use client"

import * as Cart from "@/lib/cart"
import { useState } from "react"

export type AddToCartButtonProps = {
	partNumber: number,
	maxQuantity: number
}

export default function AddToCartButton({partNumber, maxQuantity}: AddToCartButtonProps) {
	const [quantityToAdd, changeQuantityToAdd] = useState(1)
	const [hasBeenAdded, setHasBeenAdded] = useState(false)
	if (maxQuantity < 1)
		return <p>Out of stock</p>
	return (
		<div>
			<button onClick={
				() => {
					Cart.add(partNumber, quantityToAdd)
					setHasBeenAdded(true)
				}
			}>Add to Cart</button>
			<label>Quantity</label>
			<input
				type="number"
				min="1"
				max={maxQuantity}
				value={quantityToAdd}
				onChange={e=>changeQuantityToAdd(parseInt(e.target.value))}
			/>
			{
				hasBeenAdded ? (<p>Added to cart!</p>) : null
			}
		</div>
	)
}