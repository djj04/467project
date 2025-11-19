import { ShippingAndHandlingBracket } from "@/lib/db"

export async function POST(req: Request): Promise<Response> {
	const json = await req.json()
    try {
		const {old, new: newValue} = json as {old: ShippingAndHandlingBracket, new: ShippingAndHandlingBracket}
        await ShippingAndHandlingBracket.update(old, newValue)
        return new Response("", {status: 200})
    } catch (error) {
		console.error(error)
        return new Response("", { status: 500 })
    }
}