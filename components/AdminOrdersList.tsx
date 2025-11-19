import { Order } from "@/lib/db"
import styles from "./PartsList.module.css"
import AdminOrderCard from "./AdminOrderCard"

export default async function AdminOrdersList() {
    const orders = await Order.list()
    if (!orders || orders.length <= 0) {
        return (<p>No parts :(</p>)
    }
    return (
        <ul className={styles.items}>
            {orders.map(order=>(
                <li key={order.id}>
                    <AdminOrderCard
                        order={order}
                    />
                </li>
            ))}
        </ul>
    )
}