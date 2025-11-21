import { NextResponse } from 'next/server';
import { shippingAndHandlingFor } from '@/lib/db';

export async function POST(req : Request) {
    try {
        const { weightSum } = await req.json();

        const shippingAndHandlingCharges = await shippingAndHandlingFor(weightSum);

        return NextResponse.json({ result: shippingAndHandlingCharges });
    } catch (err) {
        console.error(err);

        return NextResponse.json({ error: "Error"}, { status: 500 });
    }
}