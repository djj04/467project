"use client"

export default function NewShippingAndHandlingBracketButton(
	{displayedBrackets, setDisplayedBrackets}: {displayedBrackets: any[], setDisplayedBrackets: any}
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