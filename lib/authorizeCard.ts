const VENDORID = "the best vendor"

/// Use the credit card authorization service to authorize a transaction.
///  - Parameter id: The transaction id
///  - Parameter cardNumber: The card number (NOT VALIDATED BY US, which is good in this case :D)
///  - Parameter cardholderName: The name on the card
///  - Parameter cardExpirationMonth: The month that the card expires
///  - Parameter cardExpirationYear: The year that the card expires
///  - Parameter amount: The amount of the transaction
///  - Throws: Any errors in fetching the authorization code
///  - Returns: The authorization code, or null if there was none
export async function authorizeTransaction(
	id: string,
	cardNumber: string,
	cardholderName: string,
	cardExpirationMonth: number,
	cardExpirationYear: number,
	amount: number
): Promise<string | null> {
	const result = await fetch("http://blitz.cs.niu.edu/CreditCard/", {
		method: "POST",
		body: JSON.stringify({
			vendor: VENDORID,
			trans: id,
			cc: cardNumber,
			name: cardholderName,
			exp: `${cardExpirationMonth}/${cardExpirationYear}`,
			amount: amount.toString()
		}),
		headers: {
			"content-type": "application/json",
			accept: "application/json"
		}
	})

	const jsonResult: {
		vendor:string | undefined,
		trans:string | undefined,
		cc:string | undefined,
		name:string | undefined,
		exp:string | undefined,
		amount:string | undefined,
		brand:string | undefined,
		authorization:string | undefined,
		timeStamp:number | undefined
	} = await result.json()

	if (!jsonResult.authorization) {
		console.error(`Transaction ${id} was not authorized!`)
		console.error(jsonResult)
		return null
	}

	return jsonResult.authorization
}