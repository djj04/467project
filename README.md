# 467project
This is the group project for csci467

## Running
### Development
To run while developing, use:

```bash
npm run dev
```

This will host a web server accesible on port 3000, so open [http://localhost:3000](http://localhost:3000) with your browser to see the webpage.

### Production
To build for production, run

```bash
npm run build
```

Once you have done this, you can run the production server with

```bash
npm run start
```

## Programming details
This section gives some helpful information on details of the project that could help when working on it.

### Accessing the database(s)
All sql is centralized in `lib/db.ts`. This file exports various types and functions that can be used to access the database. Anything that calls any of these functions *must be run **on the server***.

If you want to include information from the database in a client component, you need to create an api route to access the data.

If you need to add sql, add it to `lib/db.ts`.

The sql that you can use to create the new database is in `newdb.sql`.

#### How to connect to the new database
Alongside Ege's legacy database, we also have our own new database. This is implemented as a mysql (or mariadb, etc.) database. To access the database, create a file `.env.local` in the root of the repository which sets the following environment variables:
```dotenv
NEW_DB_HOST= # The host of the database. If you are hosting mariadb on your local machine, `localhost` or `127.0.0.1` or `::1` or something
NEW_DB_USER= # The username to access the database
NEW_DB_PASSWORD= # The password for the user
NEW_DB_DATABASE= # The actual database name to use
NEW_DB_PORT= # The port to use to connect to the database
```

It should be difficult for you to do this, but *absolutely **do not*** commit the `.env.local` file. It is in `.gitignore` so as long as you don't go out of your way to commit it you shouldn't need to worry about this.

If you want to host the new database yourself, fill in your details. Zoe has a mariadb server you could also use. In that case, the credentials are in the discord server. It is behind a firewall so you will need to send her your public ip address so it can be unblocked for mariadb access. NIU's entire address space (131.156.0.0/16) is already unblocked so if you are accessing it from NIU you should already be fine.

### The cart
The cart is stored clientside as a JSON array in the browser's `localStorage`. This means that anything that accesses the cart *must be run **on the client***. If you want to include information from the cart in a server component, you can't, you must include it in a client component and then include *that* in the server component.

To do anything to interact with the cart, do not use the `localStorage` apis directly. Instead, use the functions provided from `lib/cart.ts`.

### Actually sending emails
There are a couple points where customers should get sent emails. By default, this will just print to the server console that emails should be sent. However, you can configure it to actually send emails by providing the details for an SMTP server. To do this, just set the following environment variables in `.env.local`:

```dotenv
EMAIL_SMTP_HOST= #The host to connect to to send mail through
EMAIL_SMTP_PORT= #The port
EMAIL_SMTP_USER= #The username
EMAIL_SMTP_PASS= #The password
EMAIL_SENDER= #The sender of the emails
```

Everything will work just fine without this, but actually sending the emails is a cute additional feature that's nice to have :)

## API route documentation
There are the following API routes. None of them have any authentication, since that would overcomplicate the project.

### `/api/addInventory`
Used to add inventory for a given product.

#### `POST`
Takes a JSON body with the following properties:
```typescript
{
	partNumber: number, //The number of the part, i.e. its id
	quantity: number // The amount of the part to add to the inventory.
}
```

It will respond with a JSON response that has a boolean `success` property. If `true`, the request succeeded. If `false` it did not. There is also an optional `error` string which indicates an error message.

### `/api/allOrders`
Used to get *every* order in the database.

#### `GET`
Returns a json list of ALL orders with their items included. Returns the result of `Order.listWithItems`. If there is an error, an empty string will be returned as the body.

### `/api/completeOrder`
Used to finalize an order, i.e. remove the items from inventory, mark the order as shipped, and notify the customer.

#### `POST`
The order body should be a number, specifically the number of the order to finalize.

The response is an empty string on success. On failure, the response will instead contain an error message indicating what went wrong.

### `/api/newShippingAndHandlingBracket`
Adds a new shipping and handling bracket to the END of the list. It will:

1. Find the bracket with the highest end weight
2. Create a new bracket that starts at that weight and ends at the maximum weight supported by the database

#### `POST`
The request body is ignored.

The response is either an error message in the case that an error occurs, or else it is a JSON object that is the new `ShippingAndHandlingBracket` jsonified.

### `/api/order`
Creates an order, validating credit card info.

#### `POST`
The request body is a JSON object which looks like:

```typescript
{
	mailingAddress: string, // The mailing address to ship the order to
	customer: {
		name: string, // The customer's name
		emailAddress: string // The customer's email address
	},
	card: {
		number: string, // The card number. Notably it is *not a number* in terms of type
		cardholderName: string, // The name on the card
		expiration: {
			month: number,
			year: number
		}
	},
	items: Cart.Item[] // The items in the cart that will be added to the new order
}
```

The response will be a json object. If the order is succesfully created, it will look like:
```typescript
{
	success: true, // Always true or not present
	orderID: number // The id of the new order
}
```

If there is a failure, it will be a json object which has an `error` property with an error message to show the user.

### `/api/part`
Gets information for given part number(s)

#### `GET`
Takes a search param `ids` that contains a JSON array of part numbers to get information for.

The response is either an empty string in the case of an error, or else the JSONified result of `Part.listByNumber`.

### `/api/shippingAndHandlingCharges`
Gets the shipping and handling charges for a given weight

#### `POST`
The request body is a JSON object that looks like:
```typescript
{
	weightSum: number // The weight to get the charges for
}
```

The response is either a json object with a `result` property that is a number containing the shipping and handling charges, or a json object with an `error` property containing an error message.

### `/api/updateShippingAndHandling`
Updates the information for a given shipping and handling bracket

#### `POST`
The request body is a JSON object that looks like:
```typescript
{
	old: ShippingAndHandlingBracket, // The old information of the shipping and handling bracket that is being updated
	new: ShippingAndHandlingBracket // The new information to update the bracket to
}
```
The response is an empty string. Errors are indicated only in the status code.

## Page route documentation
There are the following pages. None of them have any authentication:

### `/admin`
The admin interface. One of the four main views required by the project specification, allows viewing and searching all orders, as well as viewing and editing all shipping and handling brackets.

### `/cart`
The page to view your cart and put in your details to create an order

### `/orderSuccess`
The page that is shown when an order is succesfully placed. Takes a search parameter `orderID` which is the id of the order that was succesfully placed.

### `/receiving`
The interface for the receiving desk. One of the four main views required by the project specification, allows adding inventory for a given product.

### `/warehouse`
The interface for the fulfillment part of the warehouse. One of the four main views required by the project specification, allows viewing all unshipped orders, printing various information pages about them, and marking them as shipped.

### `/warehouseInvoice`
The page that gets printed when a warehouse worker clicks the "print invoice" button on an order. Takes a search parameter `orderID` which is the id of the order to print an invoice for.

### `/warehousePackingList`
The page that gets printed when a warehouse worker clicks the "print packing list" button on an order. Takes a search parameter `orderID` which is the id of the order to print an invoice for.

### `/warehouseShippingLabel`
The page that gets printed when a warehouse worker clicks the "print shipping label" button on an order. Takes a search parameter `orderID` which is the id of the order to print an invoice for.