import { Order } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { mailingAddress, customer, card, items } = await req.json();

        const orderID = await Order.create(mailingAddress, customer, card, items);

        return NextResponse.json({ success: true, orderID }, { status: 200 });
    } catch (error: any) {
        console.error(error)
        if (error.isOrderError) {
            return NextResponse.json({error: error.userError }, { status: 400 });
        }
        return NextResponse.json({error: "Order not created" }, { status: 500 });
    }
}