import { ShippingAndHandlingBracket } from "@/lib/db";
import ShippingAndHandlingAdmin from "./ShippingAndHandlingAdmin";

export default async function AdminInterface() {
	const brackets = await ShippingAndHandlingBracket.list()
	
    return (
        <ShippingAndHandlingAdmin brackets={brackets.map(e=>JSON.parse(JSON.stringify(e)))}/>
    )
}