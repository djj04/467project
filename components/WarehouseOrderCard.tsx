import { Order } from "@/lib/db"
import WarehouseOrderControls from "./WarehouseOrderControls"

type CardProps = {
    order: Order
}

export default function AdminOrderCard({order}: CardProps) {
    return (
        <div>
            <h3>Order #{order.id}</h3>
			<p>Placed at {order.datePlaced.toISOString()}</p>
			<p>Customer: {order.customerName} <a href={`mailto:${order.customerEmailAddress}`}>&lt;{order.customerEmailAddress}&gt;</a></p>
			<p>Ship to: {order.mailingAddress}</p>
			<WarehouseOrderControls orderID={order.id}/>
        </div>
    )
}