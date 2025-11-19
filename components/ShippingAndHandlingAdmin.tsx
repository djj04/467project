"use client"
import ShippingAndHandlingBracketWidget from "./ShippingAndHandlingBracketWidget"
import NewShippingAndHandlingBracketButton from "./NewShippingAndHandlingButton"
import { useState } from "react"

export default function ShippingAndHandlingAdmin(
	{brackets}: {brackets: any[]}
) {
	const [displayedBrackets, setDisplayedBrackets] = useState(brackets)
	
    return (
		<div>
			<h2>Shipping and handling brackets</h2>
			<ul>
				{
					displayedBrackets.map(bracket => (
						<li key={bracket.startWeight}>
							<ShippingAndHandlingBracketWidget bracket={
								JSON.parse(JSON.stringify(bracket))
							} />
						</li>
					))
				}
				<li><NewShippingAndHandlingBracketButton displayedBrackets={displayedBrackets} setDisplayedBrackets={setDisplayedBrackets}/></li>
			</ul>
		</div>
    )
}