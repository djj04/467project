import { ShippingAndHandlingBracket } from "@/lib/db"

export async function POST(req: Request): Promise<Response> {
	const json = await req.json()
    try {
		const { bracketId } = json as { bracketId: number }
        await ShippingAndHandlingBracket.delete(bracketId)
        return new Response("", {status: 200})
    } catch (error) {
		console.error(error)
        return new Response("Failed to delete, unknown error", { status: 500 })
    }
}
