"use client"

import { useRouter } from "next/navigation"

export default function WarehouseOrderControls({orderID}: {orderID: number}) {
	const router = useRouter()
	const print = (baseURL: string) => {
		const listWindow = window.open(baseURL + "?orderID=" + encodeURIComponent(orderID))
		if (!listWindow) {
			alert("Cannot print, maybe unblock popups?")
			return
		}
		listWindow.onload = () => {
			listWindow.print()
			setTimeout(() => listWindow.close(), 100)
		}
	}

	const printPackingList = print.bind(null, "/warehousePackingList")
	const printInvoice = print.bind(null, "/warehouseInvoice")
	const printShippingLabel = print.bind(null, "/warehouseShippingLabel")

	const completeOrder = async () => {
		const response = await fetch("/api/completeOrder", {
			method: "POST",
			body: JSON.stringify(orderID)
		})
		if (response.status == 200) {
			alert("Success!")
			router.replace("/warehouse")
		} else {
			alert(`Failed: ${await response.text()}`)
		}
	}
	
	return (
		<div>
			<button onClick={printPackingList}>Print packing list</button>
			<button onClick={printInvoice}>Print invoice</button>
			<button onClick={printShippingLabel}>Print shipping label</button>
			<button onClick={completeOrder}>Mark order as complete</button>
		</div>
	)
}