"use client"

export default function WarehouseOrderControls({orderID}: {orderID: number}) {
	const print = (baseURL: string) => {
		const listWindow = window.open(baseURL + "?orderID=" + encodeURIComponent(orderID))
		if (!listWindow) {
			alert("Cannot print, maybe unblock popups?")
			return
		}
		listWindow.onload = () => {
			listWindow.print()
			listWindow.close()
		}
	}

	const printPackingList = print.bind(null, "/warehousePackingList")
	const printInvoice = print.bind(null, "/warehouseInvoice")
	
	return (
		<div>
			<button onClick={printPackingList}>Print packing list</button>
			<button onClick={printInvoice}>Print invoice</button>
		</div>
	)
}