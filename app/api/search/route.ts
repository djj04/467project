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
        const allParts = await Part.list(0)
        if (allParts)
        {
            const filtered = allParts.filter(p => p.description.toLowerCase().includes(query.toLowerCase()))
            res = res.concat(filtered); 
        }

        return NextResponse.json(res);
    }

    catch (error)
    {
        return NextResponse.json([], { status: 500 })
    }
}
