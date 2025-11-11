import Navbar from '@/components/Navbar';
import PartsCard from '@/components/PartsCard';

export default function Home() {
  const testamount = 24;
  const testprice = 28.95;

  return (
    <>
    <Navbar />
    <PartsCard name="testname"
               desc="this is a test description for this auto part!" 
               image="/testimg1.jfif" 
               amount={testamount}
               price={testprice}
      />
    </>
  );
}
