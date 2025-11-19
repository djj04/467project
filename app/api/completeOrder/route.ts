import { Order } from "@/lib/db"

export async function POST(req: Request): Promise<Response> {
	try {
		const orderID = await req.json()
		const order = await Order.byID(orderID)
		if (!order) {
			return new Response("Could not find order", { status: 400 })
		}
		await order.setStatus("shipped")
		console.log(`Should send order confirmation email to ${order.customerEmailAddress} regarding order #${order.id}`)
		return new Response("", {status: 200})
	} catch (error) {
		console.error(error)
		return new Response("Unspecified server error", { status: 500 })
	}
}