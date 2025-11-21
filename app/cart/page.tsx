import Navbar from '@/components/Navbar';
import CartList from '@/components/CartList';
import OrderForm from "@/components/OrderForm";
import ClearCartButton from '@/components/ClearCartButton';

export default function Home() {
    return (
        <>
        <Navbar />
        <ClearCartButton />
        <CartList />
        <OrderForm />
        </>
    )
}