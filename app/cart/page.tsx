import Navbar from '@/components/Navbar';
import CartList from '@/components/CartList';
import OrderForm from "@/components/OrderForm";

export default function Home() {
    return (
        <>
        <Navbar />
        <CartList />
        <OrderForm />
        </>
    )
}