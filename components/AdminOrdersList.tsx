import { Order } from "@/lib/db"
import ClientsideAdminOrdersList from "./ClientsideAdminOrdersList"

export default async function AdminOrdersList() {
    const orders = await Order.listWithItems()
    if (!orders || orders.length <= 0) {
        return (<p>No parts :(</p>)
    }
    return (
        <ClientsideAdminOrdersList orders={JSON.parse(JSON.stringify(orders))} />
    )
}