import Navbar from '@/components/Navbar';
import WarehouseShipmentInterface from '@/components/WarehouseShipmentInterface';
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: "Warehouse interface",
  description: "Interface for running in the warehouse for fulfilling orders",
};

export default async function Warehouse(props: {
		searchParams?: Promise<{
			orderID?: string;
		}>;
}) {

	// This is just so that the page is NOT statically built with `npm run build`. There is seemingly no documentation suggesting a better way to do this??
	await props.searchParams
  return (
	<>
	<Navbar />
	<WarehouseShipmentInterface />
	</>
  );
}
