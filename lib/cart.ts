export namespace Cart {
	const KEY = "cart"
	
	export function add(partNumber: number) {
		const contents: Item[] = JSON.parse(localStorage.getItem(KEY) || "[]")
		contents.push({number: partNumber})
		localStorage.setItem(KEY, JSON.stringify(contents))
	}

	export function alreadyHas(partNumber: number): boolean {
		const contents: Item[] = JSON.parse(localStorage.getItem(KEY) || "[]")
		return contents.findIndex(e=>e.number == partNumber) != -1
	}

	type Item = {
		number: number
	}
}