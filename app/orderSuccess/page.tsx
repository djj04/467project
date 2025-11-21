import Navbar from "@/components/Navbar";
import { Order } from "@/lib/db";

export default async function OrderSuccess(
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
	
	
	return (
	<>
		<Navbar />
		<h1>Success!</h1>
		<p>Succesfully created order #{order.id}!</p>
		<p>It will ship to {order.customerName} at {order.mailingAddress} soon!</p>
		<p>You will recieve an email at <a href={`mailto:${order.customerEmailAddress}`}>{order.customerEmailAddress}</a> to confirm when it does!</p>
	</>
	);
}
