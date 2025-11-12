"use client"

import { Cart } from "@/lib/cart"

export type AddToCartButtonProps = {
	partNumber: number
}

export default function AddToCartButton({partNumber}: AddToCartButtonProps) {
	if (Cart.alreadyHas(partNumber))
		return <p>In cart</p>
	return (
		<button onClick={Cart.add.bind(null, partNumber)}>Add to Cart</button>
	)
}