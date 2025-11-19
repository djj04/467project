"use client"

import { useState } from "react";
import AdminOrderCard from "./AdminOrderCard";

export default function ClientsideAdminOrdersList({orders}: {orders: any[]}) {
	let [filterIncludesAuthorized, setFilterIncludesAuthorized] = useState(true)
	let [filterIncludesShipped, setFilterIncludesShipped] = useState(true)

	let [minimumPrice, setMinimumPrice] = useState(-99999999.99)
	let [maximumPrice, setMaximumPrice] = useState(99999999.99)
	
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
				<div>
					<h4>Price</h4>
					<label htmlFor="minimum-price">From: </label>
					<input type="number" step="any" id="minimum-price" value={minimumPrice} onChange={e=>setMinimumPrice(parseFloat(e.target.value))} />
					<label htmlFor="maximum-price"> to: </label>
					<input type="number" step="any" id="maximum-price" value={maximumPrice} onChange={e=>setMaximumPrice(parseFloat(e.target.value))} />
				</div>
			</div>
			<ul>
				{orders
					.filter(order => (
						(
							(filterIncludesAuthorized && order.order.status == "authorized") ||
							(filterIncludesShipped && order.order.status == "shipped")
						) && (
							order.order.totalPriceCharged >= minimumPrice &&
							order.order.totalPriceCharged <= maximumPrice
						)
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