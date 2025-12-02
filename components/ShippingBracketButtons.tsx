"use client"

import { Dispatch, SetStateAction } from "react"

export default function ShippingBracketButtons(
	{displayedBrackets, setDisplayedBrackets}: {
		displayedBrackets: {
			bracketId: number,
			startWeight: number,
			endWeight: number,
			charge: number
		}[],
		setDisplayedBrackets: Dispatch<SetStateAction<{
			bracketId: number,
			startWeight: number,
			endWeight: number,
			charge: number
		}[]>>
	}
) {
	const newBracket = async () => {
		const response = await fetch("/api/newShippingAndHandlingBracket", {
			method: "POST",
			body: ""
		})
		if (response.status == 200) {
			const newDisplayedBrackets = JSON.parse(JSON.stringify(displayedBrackets))
			newDisplayedBrackets.push(await response.json())
			setDisplayedBrackets(newDisplayedBrackets)
		} else (
			alert(await response.text())
		)
	}

	const deleteBracket = async (bracketId: number) => {
		if (!confirm("Are you sure you want to delete this bracket?")) {
			return
		}
		const response = await fetch("/api/deleteShippingAndHandlingBracket", {
			method: "POST",
			body: JSON.stringify({ bracketId })
		})
		if (response.status == 200) {
			const newDisplayedBrackets = displayedBrackets.filter(bracket => bracket.bracketId !== bracketId)
			setDisplayedBrackets(newDisplayedBrackets)
		} else {
			alert(await response.text())
		}
	}
	
	return (
		<div>
			<button onClick={newBracket}>Add new bracket</button>
		</div>
	)
}