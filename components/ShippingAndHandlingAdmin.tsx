import { ShippingAndHandlingBracket } from "@/lib/db"
import ShippingAndHandlingBracketWidget from "./ShippingAndHandlingBracketWidget"

export default async function ShippingAndHandlingAdmin() {
	const brackets = await ShippingAndHandlingBracket.list()
	
    return (
		<div>
			<h2>Shipping and handling brackets</h2>
			<ul>
				{
					brackets.map(bracket => (
						<li key={bracket.startWeight}>
							<ShippingAndHandlingBracketWidget bracket={
								JSON.parse(JSON.stringify(bracket))
							} />
						</li>
					))
				}
			</ul>
		</div>
    )
}