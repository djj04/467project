import Navbar from '@/components/Navbar';
import CartListWrapper from '@/components/CartListWrapper';
import OrderForm from "@/components/OrderForm";
import ClearCartButton from '@/components/ClearCartButton';
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: "Cart",
  description: "Cart page for website for CSCI467",
};

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