import Navbar from '@/components/Navbar';
import RecPartsList from '@/components/RecPartsList';
import PartsListPaginationNav from '@/components/PartsListPaginationNav';
import SearchItem from '@/components/SearchItem';

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
        <SearchItem />
        <RecPartsList pageNumber={pageNumber} />
        <PartsListPaginationNav pageNumber={pageNumber}/>
        </>
    )
}