import Navbar from '@/components/Navbar';
import  './globals.css';
import PartToggle from '@/components/PartToggle';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Home",
  description: "Homepage for website for CSCI467",
};

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
    <PartToggle pageNumber={pageNumber}/>
    </>
  );
}
