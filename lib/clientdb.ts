"use server"

import { Part } from "./db";

export async function partByNumber(number: number): Promise<any | null> {
	return JSON.parse(JSON.stringify(await Part.byNumber(number)))
}