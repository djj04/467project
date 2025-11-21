"use client"

import dynamic from 'next/dynamic';

// The cart list absolutely can*not* be rendered outside of
// a client environment, so use this wrapper instead of the
// raw CartList component to ensure that it is never rendered
// serverside (`ssr: false`)
export default dynamic(
  () => import('@/components/CartList'),
  { ssr: false }
)