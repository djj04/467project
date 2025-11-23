import Navbar from '@/components/Navbar';
import PartsList from '@/components/PartsList';
import PartsListPaginationNav from '@/components/PartsListPaginationNav';
import SearchItem from '@/components/SearchItem';
import  './globals.css';

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

  return (
    <>
    <Navbar />
    <SearchItem />
    <PartsList pageNumber={pageNumber} />
    <PartsListPaginationNav pageNumber={pageNumber}/>
    </>
  );
}
