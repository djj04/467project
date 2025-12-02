import { ShippingAndHandlingBracket } from "@/lib/db"

export async function POST(): Promise<Response> {
	try {
		const brackets = await ShippingAndHandlingBracket.list()

		if (brackets.length === 0) {
			const newBracket = await ShippingAndHandlingBracket.addNew(
				0,
				ShippingAndHandlingBracket.HIGHEST_POSSIBLE_WEIGHT,
				0 // charge
			)
			if (!newBracket) {
				return new Response("Could not add starting bracket", { status: 500 })
			}
			return new Response(JSON.stringify(newBracket), {status: 200})
		}
		
		const highestWeightBracket = brackets.reduce(
			(previousValue, currentValue) => 
				currentValue.endWeight > previousValue.endWeight ? 
					currentValue : 
					previousValue
		)
		if (highestWeightBracket.endWeight >= ShippingAndHandlingBracket.HIGHEST_POSSIBLE_WEIGHT) {
			return new Response("Cannot add new bracket! There is already a bracket that ends at the max weight", { status: 400 })
		}
		const newBracket = await ShippingAndHandlingBracket.addNew(
			highestWeightBracket.endWeight,
			ShippingAndHandlingBracket.HIGHEST_POSSIBLE_WEIGHT,
			0 // charge
		)
		if (!newBracket) {
			return new Response("Could not add bracket", { status: 500 })
		}
		return new Response(JSON.stringify(newBracket), {status: 200})
	} catch (error) {
		console.error(error)
		return new Response("Unspecified server error", { status: 500 })
	}
}