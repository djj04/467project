import {Part} from "@/lib/db"

export async function GET(req: Request): Promise<Response> {
    const { searchParams } = new URL(req.url)
    const jsonNumbers = searchParams.get('ids')
    
    if (!jsonNumbers) {
        return new Response("", { status: 400 })
    }

    const numbers = JSON.parse(jsonNumbers)
    
    try {
        const parts = await Part.listByNumber(numbers)
        return new Response(JSON.stringify(parts), {status: 200})
    } catch (error) {
        return new Response("", { status: 500 })
    }
}
