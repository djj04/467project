import { Order } from "@/lib/db"

export async function POST(req: Request): Promise<Response> {
	try {
		const orderID = await req.json()
		const order = await Order.byID(orderID)
		if (!order) {
			return new Response("Could not find order", { status: 400 })
		}
		await order.finalize()
		console.log(`Should send order confirmation email to ${order.customerEmailAddress} regarding order #${order.id}`)
		return new Response("", {status: 200})
	// eslint-disable-next-line
	} catch (error: any) {
		console.error(error)
		if (error.canShowUser) {
			return new Response(error.message, { status: 400 })
		}
		return new Response("Unspecified server error", { status: 500 })
	}
}