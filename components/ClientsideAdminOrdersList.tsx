"use client"

import { useState } from "react";
import AdminOrderCard from "./AdminOrderCard";

export default function ClientsideAdminOrdersList({orders}: {orders: any[]}) {
	let [filterIncludesAuthorized, setFilterIncludesAuthorized] = useState(true)
	let [filterIncludesShipped, setFilterIncludesShipped] = useState(true)
	
	return (
		<div>
			<div>
				<h3>Filter</h3>
				<div>
					<h4>Status</h4>
					<input type="checkbox" id="authorized" checked={filterIncludesAuthorized} onChange={e=>setFilterIncludesAuthorized(e.target.checked)} /> <label htmlFor="authorized">authorized</label>
					<br />
					<input type="checkbox" id="shipped" checked={filterIncludesShipped} onChange={e=>setFilterIncludesShipped(e.target.checked)} /> <label htmlFor="shipped">shipped</label>
				</div>
			</div>
			<ul>
				{orders
					.filter(order => (
						(filterIncludesAuthorized && order.order.status == "authorized") ||
						(filterIncludesShipped && order.order.status == "shipped")
					))
					.map(order=>(
					<li key={order.order.id}>
						<AdminOrderCard
							order={order}
						/>
					</li>
				))}
			</ul>
		</div>
	)
}