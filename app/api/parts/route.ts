import {Part} from "@/lib/db"

export async function GET(req: Request): Promise<Response> {
	const { searchParams } = new URL(req.url)
	const pageStr = searchParams.get('page')
	
	if (!pageStr) {
		return new Response("", { status: 400 })
	}

	const page = parseInt(pageStr)
	
	try {
		const parts = await Part.list(page)
		return new Response(JSON.stringify(parts), {status: 200})
	} catch (error) {
		console.error(error)
		return new Response("", { status: 500 })
	}
}
