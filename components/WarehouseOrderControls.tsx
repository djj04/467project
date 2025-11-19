"use client"

export default function WarehouseOrderControls({orderID}: {orderID: number}) {
	const printPackingList = () => {
		const listWindow = window.open("/warehousePackingList?orderID=" + encodeURIComponent(orderID))
		if (!listWindow) {
			alert("Cannot print, maybe unblock popups?")
			return
		}
		listWindow.onload = () => {
			listWindow.print()
			listWindow.close()
		}
	}
	
	return (
		<div>
			<button onClick={printPackingList}>Print packing list</button>
		</div>
	)
}