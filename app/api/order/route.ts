import { Order } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { mailingAddress, customer, card, items } = await req.json();

        await Order.create(mailingAddress, customer, card, items);

        return NextResponse.json({ success: true}, { status: 200 });
    } catch {
        return NextResponse.json({error: "Order not created" }, { status: 500 });
    }
}