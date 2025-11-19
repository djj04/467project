import { Order } from '@/lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == "POST") {
        const { mailingAddress, customer, card, items } = req.body;
        try {
            const newOrder = await Order.create(mailingAddress, customer, card, items);
            res.status(200).json(newOrder);
        } catch (err) {
            res.status(500).json({ error: "Order Not Created"});
        }
    } else {
        res.status(405).json({ error: "Must be POST"});
    }
}