import { NextResponse } from "next/server"
import {Part} from "@/lib/db"

export async function POST(req: Request) {
  try {
    const { partNumber, quantity } = await req.json()

    const success = await Part.subtractInventory(partNumber, quantity)
    return NextResponse.json({ success })
  } catch (error) {
    console.error("Error updating inventory:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}