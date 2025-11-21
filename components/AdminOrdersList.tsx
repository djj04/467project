"use client"

import { Suspense, useEffect, useState } from "react";
import AdminOrderCard from "./AdminOrderCard";

export default function AdminOrdersList() {
	const _os: any[] = useState([])
	const [orders, setOrders] = _os

	useEffect(() => {
		const get = async () => {
			const response = await fetch("/api/allOrders")
			setOrders(await response.json())
		}
		get()
	}, [])
	
	const [filterIncludesAuthorized, setFilterIncludesAuthorized] = useState(true)
	const [filterIncludesShipped, setFilterIncludesShipped] = useState(true)

	const [minimumPrice, setMinimumPrice] = useState(-99999999.99)
	const [maximumPrice, setMaximumPrice] = useState(99999999.99)

	const [minimumDate, setMinimumDate] = useState("2001-01-01")
	const [maximumDate, setMaximumDate] = useState("3001-01-01")
	
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
				<div>
					<h4>Date placed</h4>
					<label htmlFor="minimum-date">From: </label>
					<input type="date" step="any" id="minimum-date" value={minimumDate} onChange={e=>setMinimumDate(e.target.value)} />
					<label htmlFor="maximum-date"> to: </label>
					<input type="date" step="any" id="maximum-date" value={maximumDate} onChange={e=>setMaximumDate(e.target.value)} />
				</div>
			</div>
			<ul>
				{orders
					.filter((order: any) => (
						(
							(filterIncludesAuthorized && order.order.status == "authorized") ||
							(filterIncludesShipped && order.order.status == "shipped")
						) && (
							order.order.totalPriceCharged >= minimumPrice &&
							order.order.totalPriceCharged <= maximumPrice
						) && (
							Date.parse(order.order.datePlaced) >= Date.parse(minimumDate) &&
							Date.parse(order.order.datePlaced) <= Date.parse(maximumDate)
						)
					))
					.map((order: any)=>(
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