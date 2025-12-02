"use client"
import { useState } from "react"
import UnsavedChangesButton from "./UnsavedChangesButton"

export default function ShippingAndHandlingBracketWidget(
	{bracket, onDelete}: {
		bracket: {bracketId: number, startWeight: number, endWeight: number, charge: number}
		onDelete?: (bracketId: number) => void
	}
) {
	const [mostRecentlySaved, setMostRecentlySaved] = useState(bracket)
	const [startWeight, setLocalStartWeight] = useState(bracket.startWeight)
	const [endWeight, setLocalEndWeight] = useState(bracket.endWeight)
	const [charge, setLocalCharge] = useState(bracket.charge)
	
	const saveValues = async () => {
		const response = await fetch("/api/updateShippingAndHandling", {
			method: "POST",
			body: JSON.stringify({
				old: mostRecentlySaved,
				new: {bracketId: bracket.bracketId, startWeight, endWeight, charge}
			})
		})
		if (response.status == 200)
			setMostRecentlySaved({bracketId: bracket.bracketId, startWeight, endWeight, charge})
	}

	const deleteBracket = async () => {
		if (!confirm("Are you sure you want to delete this bracket?")) {
			return
		}
		const response = await fetch("/api/deleteShippingAndHandlingBracket", {
			method: "POST",
			body: JSON.stringify({ bracketId: bracket.bracketId })
		})
		if (response.status == 200 && onDelete) {
			onDelete(bracket.bracketId)
		} else {
			alert(await response.text())
		}
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
				onInput={ e => setLocalStartWeight(parseFloat((e.target as HTMLInputElement).value)) }
			/>
			<br />
			<label htmlFor="end-weight">End weight</label>
			<input
				type="number"
				step="any"
				min="0"
				id="end-weight"
				value={endWeight}
				onInput={ e => setLocalEndWeight(parseFloat((e.target as HTMLInputElement).value)) }
			/>
			<br />
			<label htmlFor="charge">Charge</label>
			<input
				type="number"
				step="any"
				min="0"
				id="charge"
				value={charge}
				onInput={ e => setLocalCharge(parseFloat((e.target as HTMLInputElement).value)) }
			/>
			<br />
			{
				(
					startWeight != mostRecentlySaved.startWeight ||
					endWeight != mostRecentlySaved.endWeight ||
					charge != mostRecentlySaved.charge
				) ? <UnsavedChangesButton /> : null
			}
			<button type="button" onClick={deleteBracket} style={{color: 'red'}}>Delete bracket</button>
		</form>
	)
}