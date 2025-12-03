import { NextResponse } from "next/server"
import { Part } from "@/lib/db"

export async function GET(request: Request)
{
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("query") || ""
    const page = searchParams.get("page") || ""

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
        const allParts = await allPartsFor(query, parseInt(page) || 0)
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

async function allPartsFor(query: string, page: number): Promise<Part[] | null> {
    console.log(query)
    if (query == "") {
        return await Part.list(page)
    } else {
        return await Part.listLike(`%${query}%`, page)
    }
}