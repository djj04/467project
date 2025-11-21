import {Order} from "@/lib/db"

export async function GET(_: Request): Promise<Response> {
	try {
		const orders = await Order.listWithItems()
		return new Response(JSON.stringify(orders), {status: 200})
	} catch (error) {
		return new Response("", { status: 500 })
	}
}
