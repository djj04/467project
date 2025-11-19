"use client"

import AdminOrderCard from "./AdminOrderCard";

export default function ClientsideAdminOrdersList({orders}: {orders: any[]}) {
	return (
		<ul>
            {orders.map(order=>(
                <li key={order.order.id}>
                    <AdminOrderCard
                        order={order}
                    />
                </li>
            ))}
        </ul>
	)
}