import { Order, Part, ShippingAndHandlingBracket, shippingAndHandlingFor } from "@/lib/db";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Invoice",
  description: "",
};

export default async function WarehouseInvoice(
	props: {
		searchParams?: Promise<{
			orderID?: string;
		}>;
	}
) {
	const orderID = !props.searchParams ? -1 : parseInt(
		(await props.searchParams).orderID || "-1"
	)
	if (orderID == -1) {
		return (<h1>Invalid order</h1>)
	}

	const order = await Order.byID(orderID)
	if (!order) {
		return (<h1>Could not find order #{orderID}</h1>)
	}
	const parts = await Part.listFromOrder(order)
	if (!parts) {
		return (<h1>Empty order</h1>)
	}

	const totalWeight = parts?.reduce((sum, part) => sum + (part.quantity * part.part.weight), 0) || 0
	
	let shippingCharge = 0
	try {
		shippingCharge = await shippingAndHandlingFor(totalWeight)
	} catch (error) {
		console.error("Could not determine shipping charge:", error)
	}
	
	return (
	<>
		<h1>Order #{order.id}</h1>
		<ul>
			{
				parts.map(part => (
					<li key={part.part.number}>
						{part.quantity}x Part #{part.part.number} – {part.part.description} – ${part.part.price * part.quantity}
					</li>
				))
			}
		</ul>
		<hr />
		<h2>Order Summary</h2>
		<p><strong>Subtotal: </strong> ${parts.reduce((total, part) => total + part.part.price * part.quantity, 0).toFixed(2)}</p>
		<p>Total Weight: {totalWeight.toFixed(2)}kg</p>
		<p>Shipping & Handling Charge: ${shippingCharge.toFixed(2)}</p>
		<p><strong>Total price:</strong> ${(parts.reduce((total, part) => total + part.part.price * part.quantity, 0) + shippingCharge).toFixed(2)}</p>
	</>
	);
}
