import { NextResponse } from "next/server"
import { Part } from "@/lib/db"

export async function GET(request: Request)
{
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("query") || ""

    try
    {
        let res: Part[] = [] 

        //Search By Part Number 
        const numQ = parseInt(query)
        if (!isNaN(numQ))
        {
            const part = await Part.byNumber(numQ)
            if (part)
            {
                res.push(part)
            }
        }

        //Search By Part Name
        //TODO: Pagination
        const allParts = await Part.listLike(`%${query}%`, 0)
        if (allParts)
        {
            res = res.concat(allParts); 
        }

        return NextResponse.json(res);
    }

    catch (error)
    {
        return NextResponse.json([], { status: 500 })
    }
}
