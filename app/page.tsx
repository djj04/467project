import Navbar from '@/components/Navbar';
import PartsCard from '@/components/PartsCard';
import PartsList from '@/components/PartsList';

export default function Home() {
  const testamount = 24;
  const testprice = 28.95;

  return (
    <>
    <Navbar />
    <PartsList pageNumber={0} />
    </>
  );
}
