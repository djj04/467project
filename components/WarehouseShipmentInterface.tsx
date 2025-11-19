import { Order } from "@/lib/db"
import WarehouseOrderCard from "./WarehouseOrderCard"

export default async function WarehouseShipmentInterface() {
	const orders = await Order.listOfUnshipped()
	if (!orders || orders.length <= 0) {
		return (<p>All orders shipped!</p>)
	}
	return (
		<ul>
			{orders.map(order=>(
				<li key={order.id}>
					<WarehouseOrderCard order={order} />
				</li>
			))}
		</ul>
	)
}