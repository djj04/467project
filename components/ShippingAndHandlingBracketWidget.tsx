"use client"
import { useState } from "react"
import UnsavedChangesButton from "./UnsavedChangesButton"

export default function ShippingAndHandlingBracketWidget(
	{bracket}: {
		bracket: {startWeight: number, endWeight: number, charge: number}
	}
) {
	let [mostRecentlySaved, setMostRecentlySaved] = useState(bracket)
	let [startWeight, setLocalStartWeight] = useState(bracket.startWeight)
	let [endWeight, setLocalEndWeight] = useState(bracket.endWeight)
	let [charge, setLocalCharge] = useState(bracket.charge)
	
	const saveValues = async () => {
		const response = await fetch("/api/updateShippingAndHandling", {
			method: "POST",
			body: JSON.stringify({
				old: mostRecentlySaved,
				new: {startWeight, endWeight, charge}
			})
		})
		if (response.status == 200)
			setMostRecentlySaved({startWeight, endWeight, charge})
	}
	
	return (
		<form onSubmit={e=>{e.preventDefault();saveValues()}}>
			<label htmlFor="start-weight">Start weight</label>
			<input
				type="number"
				step="any"
				min="0"
				id="start-weight"
				value={startWeight}
				onInput={ e => setLocalStartWeight((e.target as any).value) }
			/>
			<br />
			<label htmlFor="end-weight">End weight</label>
			<input
				type="number"
				step="any"
				min="0"
				id="end-weight"
				value={endWeight}
				onInput={ e => setLocalEndWeight((e.target as any).value) }
			/>
			<br />
			<label htmlFor="charge">Charge</label>
			<input
				type="number"
				step="any"
				min="0"
				id="charge"
				value={charge}
				onInput={ e => setLocalCharge((e.target as any).value) }
			/>
			<br />
			{
				(
					startWeight != mostRecentlySaved.startWeight ||
					endWeight != mostRecentlySaved.endWeight ||
					charge != mostRecentlySaved.charge
				) ? <UnsavedChangesButton /> : null
			}
		</form>
	)
}