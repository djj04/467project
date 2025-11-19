import { Order, Part } from '@/lib/db';

type CardProps = {
    order: Order
}

export default async function AdminOrderCard({order}: CardProps) {
	const items = await Part.listFromOrder(order)
	
    return (
        <div>
            <h3>Order #{order.id}</h3>
			<p>Placed at {order.datePlaced.toISOString()}, shipped at {order.dateShipped?.toISOString() || "never, yet"}</p>
			<p>Status: {order.status}</p>
			<p>Customer: {order.customerName} <a href={`mailto:${order.customerEmailAddress}`}>&lt;{order.customerEmailAddress}&gt;</a></p>
			<p>Price: ${Math.round(order.totalPriceCharged * 100) / 100}</p>
			<p>Shipped to: {order.mailingAddress}</p>
			<details>
				<summary>Items in the order</summary>
				<ul>
					{
						items?.map(item => (
							<li key={item.part.number}>
								{item.quantity} of #{item.part.number} ({item.part.description})
							</li>
						))
					}
				</ul>
			</details>
        </div>
    )
}