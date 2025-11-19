import { Order } from '@/lib/db';

type CardProps = {
    order: Order
}

export default function AdminOrderCard({order}: CardProps) {
    return (
        <div>
            <h3>Order #{order.id}</h3>
			<p>Placed at {order.datePlaced.toISOString()}, shipped at {order.dateShipped?.toISOString() || "never, yet"}</p>
			<p>Status: {order.status}</p>
			<p>Customer: {order.customerName} <a href={`mailto:${order.customerEmailAddress}`}>&lt;{order.customerEmailAddress}&gt;</a></p>
			<p>Price: ${Math.round(order.totalPriceCharged * 100) / 100}</p>
			<p>Shipped to: {order.mailingAddress}</p>
        </div>
    )
}