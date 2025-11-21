import { Order } from "@/lib/db"
import { sendEmail } from "@/lib/email"

export async function POST(req: Request): Promise<Response> {
	try {
		const orderID = await req.json()
		const order = await Order.byID(orderID)
		if (!order) {
			return new Response("Could not find order", { status: 400 })
		}
		await order.finalize()
		sendEmail(
			`Order #${order.id} has shipped!`,
			`Your order placed on ${order.datePlaced.toUTCString()} has been shipped!`,
			order.customerEmailAddress
		)
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