"use client"

import { Dispatch, SetStateAction } from "react"

export default function NewShippingAndHandlingBracketButton(
	{displayedBrackets, setDisplayedBrackets}: {
		displayedBrackets: {
			startWeight: number,
			endWeight: number,
			charge: number
		}[],
		setDisplayedBrackets: Dispatch<SetStateAction<{
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
	
	return (<button onClick={newBracket}>Add new bracket</button>)
}