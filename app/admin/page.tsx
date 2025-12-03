import Navbar from '@/components/Navbar';
import AdminInterface from '@/components/AdminInterface';
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: "Admin interface",
  description: "The admin interface for CSCI467 project",
};

export default async function Admin(props: {
		searchParams?: Promise<{
			orderID?: string;
		}>;
}) {

	// This is just so that the page is NOT statically built with `npm run build`. There is seemingly no documentation suggesting a better way to do this??
	await props.searchParams
	
  return (
	<>
	<Navbar />
	<AdminInterface />
	</>
  );
}
