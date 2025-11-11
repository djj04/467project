import type { NextApiRequest, NextApiResponse } from 'next'
import { Legacy } from '@/lib/db';
import { QueryResult } from 'mysql2';

export async function GET(req: NextApiRequest,
  res: NextApiResponse<QueryResult>) { 
    const rows = await Legacy.query('SELECT * FROM parts LIMIT 5');
    return res.json(rows);
}