import Navbar from '@/components/Navbar';
import RecPartsList from '@/components/RecPartsList';
import PartsListPaginationNav from '@/components/PartsListPaginationNav';

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

    return (
        <>
        <Navbar />
        <RecPartsList pageNumber={pageNumber} />
        <PartsListPaginationNav pageNumber={pageNumber}/>
        </>
    )
}