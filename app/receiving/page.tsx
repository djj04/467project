import Navbar from '@/components/Navbar';
import RecPartsList from '@/components/RecPartsList';
import PartsListPaginationNav from '@/components/PartsListPaginationNav';
import { Metadata } from 'next';
import { Part } from '@/lib/db';


export const metadata: Metadata = {
  title: "Receiving desk interface",
  description: "Interface to run at the warehouse receiving desk for registering new inventory",
};

export default async function Receiving(
  props: {
    searchParams?: Promise<{
      page?: string;
    }>;
  }
) {
    const pageNumber = !props.searchParams ? 0 : parseInt(
      (await props.searchParams).page || "0"
    )

    const parts = JSON.parse(JSON.stringify(await Part.list(pageNumber)))

    return (
        <>
        <Navbar />
        <RecPartsList initialParts={parts} />
        <PartsListPaginationNav pageNumber={pageNumber}/>
        </>
    )
}