"use client"
import ShippingAndHandlingBracketWidget from "./ShippingAndHandlingBracketWidget"
import NewShippingAndHandlingBracketButton from "./ShippingBracketButtons"
import { useState } from "react"

export default function ShippingAndHandlingAdmin(
	{brackets}: {
		brackets: {
			bracketId: number,
			startWeight: number,
			endWeight: number,
			charge: number
		}[]
}
) {
	const [displayedBrackets, setDisplayedBrackets] = useState(brackets)

	const handleDeleteBracket = (bracketId: number) => {
		const newBrackets = displayedBrackets.filter(bracket => bracket.bracketId !== bracketId)
		setDisplayedBrackets(newBrackets)
	}
	
    return (
		<div>
			<h2>Shipping and handling brackets</h2>
			<ul>
				{
					displayedBrackets.map(bracket => (
						<li key={bracket.bracketId}>
							<ShippingAndHandlingBracketWidget 
								bracket={JSON.parse(JSON.stringify(bracket))}
								onDelete={handleDeleteBracket}
							/>
						</li>
					))
				}
				<li><NewShippingAndHandlingBracketButton displayedBrackets={displayedBrackets} setDisplayedBrackets={setDisplayedBrackets}/></li>
			</ul>
		</div>
    )
}