import Navbar from '@/components/Navbar';
import PartsList from '@/components/PartsList';
import PartsListPaginationNav from '@/components/PartsListPaginationNav';
import  './globals.css';
import { Order } from '@/lib/db';

export default async function Home(
  props: {
    searchParams?: Promise<{
      page?: string;
    }>;
  }
) {
  const pageNumber = !props.searchParams ? 0 : parseInt(
    (await props.searchParams).page || "0"
  )
  Order.create("101 street rd. dekalb il 60115", {name: "Test user", emailAddress: "testuser@example.com"}, {number: "0000000000", cardholderName: "Super user", expiration: {month: 12, year: 2026}}, [{number: 3, quantity: 3}])

  return (
    <>
    <Navbar />
    <PartsList pageNumber={pageNumber} />
    <PartsListPaginationNav pageNumber={pageNumber}/>
    </>
  );
}
