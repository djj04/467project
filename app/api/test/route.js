import { nextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() { 
    const rows = await query('SELECT * FROM csci467 LIMIT 5');
    return nextResponse.json(rows);
}