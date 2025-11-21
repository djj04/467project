import Navbar from '@/components/Navbar';
import CartListWrapper from '@/components/CartListWrapper';
import OrderForm from "@/components/OrderForm";
import ClearCartButton from '@/components/ClearCartButton';

export default function Home() {
    return (
        <>
        <Navbar />
        <ClearCartButton />
        <CartListWrapper />
        <OrderForm />
        </>
    )
}