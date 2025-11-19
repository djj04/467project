import { Order, Part } from "@/lib/db";

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
		<p>Total price: ${parts.reduce((total, part) => total + part.part.price * part.quantity, 0)}</p>
	</>
	);
}
