"use client"

type CardProps = {
    order: {
		order: {
			id: number
			mailingAddress: string
			customerName: string
			customerEmailAddress: string
			totalPriceCharged: number
			cardAuthorizationCode: string
			status: "authorized" | "shipped"
			datePlaced: string
			dateShipped: string
		}
		items: {
			part: {
				number: number
				description: string
				price: number
				weight: number
				pictureURL: string
				inventoryCount: number
			}
			quantity: number
		}[]
	}
}

export default function AdminOrderCard({order}: CardProps) {
    return (
        <div>
            <h3>Order #{order.order.id}</h3>
			<p>Placed at {order.order.datePlaced}, shipped at {order.order.dateShipped || "never, yet"}</p>
			<p>Status: {order.order.status}</p>
			<p>Customer: {order.order.customerName} <a href={`mailto:${order.order.customerEmailAddress}`}>&lt;{order.order.customerEmailAddress}&gt;</a></p>
			<p>Price: ${Math.round(order.order.totalPriceCharged * 100) / 100}</p>
			<p>Shipped to: {order.order.mailingAddress}</p>
			<details>
				<summary>Items in the order</summary>
				<ul>
					{
						order.items.map(item => (
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