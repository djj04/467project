import { ShippingAndHandlingBracket } from "@/lib/db";
import ShippingAndHandlingAdmin from "./ShippingAndHandlingAdmin";
import AdminOrdersList from "./AdminOrdersList";

export default async function AdminInterface() {
	const brackets = await ShippingAndHandlingBracket.list()
	
    return (
		<div>
			<details open={true}>
				<summary>All Orders</summary>
				<AdminOrdersList />
			</details>
			<hr />
			<ShippingAndHandlingAdmin brackets={brackets.map(e=>JSON.parse(JSON.stringify(e)))}/>
		</div>
    )
}