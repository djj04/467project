"use client"

import * as Cart from "@/lib/cart"
import { useState } from "react"
import styles from './AddToCartButton.module.css';

export type AddToCartButtonProps = {
	partNumber: number,
	maxQuantity: number
}

export default function AddToCartButton({partNumber, maxQuantity}: AddToCartButtonProps) {
	const [quantityToAdd, changeQuantityToAdd] = useState(1)
	const [hasBeenAdded, setHasBeenAdded] = useState(false)
	if (maxQuantity < 1)
		return <p className={styles.cartOut}>Out of stock</p>
	return (
		<div>
			{
				<p className={styles.cartText}>
					{hasBeenAdded ? "Added to Cart!" : "\u00A0"}
				</p>
			}
			<div className={styles.buttonQuantity}>
				<button onClick={
					() => {
						Cart.add(partNumber, quantityToAdd)
						setHasBeenAdded(true)

						setTimeout(() => {
							setHasBeenAdded(false);
						}, 2000);
					}
				}>Add to Cart</button>
				<div>
					<label>Quantity:</label>
					<input className={styles.cartLabel}
						type="number"
						min="1"
						max={maxQuantity}
						value={quantityToAdd}
						onChange={e=>changeQuantityToAdd(parseInt(e.target.value))}
					/>
				</div>
			</div>
		</div>
	)
}