export namespace Cart {
	const KEY = "cart"
	
	// Adds an item to the cart with a given quantity. If the item is already in the cart, overwrite the quantity.
	export function add(partNumber: number, quantity: number) {
		const contents: Item[] = JSON.parse(localStorage.getItem(KEY) || "[]")
		const existingIndex = contents.findIndex(e=>e.number == partNumber)
		if (existingIndex != -1) {
			contents[existingIndex].quantity = quantity
		} else {
			contents.push({number: partNumber, quantity: quantity})
		}
		localStorage.setItem(KEY, JSON.stringify(contents))
	}

	export function alreadyHas(partNumber: number): boolean {
		const contents: Item[] = JSON.parse(localStorage.getItem(KEY) || "[]")
		return contents.findIndex(e=>e.number == partNumber) != -1
	}

	export function allItems(): Item[] {
		return JSON.parse(localStorage.getItem(KEY) || "[]")
	}

	type Item = {
		number: number,
		quantity: number
	}
}