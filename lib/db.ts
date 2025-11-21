import mysql from 'mysql2/promise';
import * as Cart from './cart';
import { authorizeTransaction } from './authorizeCard';
import { sendEmail } from './email';

const Legacy = {
    pool: mysql.createPool({
        host: 'blitz.cs.niu.edu',
        user: 'student',
        password: 'student',
        database: 'csci467',
        port: 3306,
        ssl: {
            //TODO: Use system ca
            rejectUnauthorized: false
        },
    }),
    /// Throws
    // eslint-disable-next-line
    async query(sql: string, params: any | null = null): Promise<any> {
        const [rows] = await this.pool.execute(sql, params);
        return rows;
    }
}

const New = {
    //TODO: ssl?
    pool: mysql.createPool ({
        host: process.env.NEW_DB_HOST || "No value for environment variable NEW_DB_HOST, check .env.local in the root of the project",
        user: process.env.NEW_DB_USER || "No value for environment variable NEW_DB_USER, check .env.local in the root of the project",
        password: process.env.NEW_DB_PASSWORD || "No value for environment variable NEW_DB_PASSWORD, check .env.local in the root of the project",
        database: process.env.NEW_DB_DATABASE || "No value for environment variable NEW_DB_DATABASE, check .env.local in the root of the project",
        port: parseInt(process.env.NEW_DB_PORT || "3306")
    }),
    // eslint-disable-next-line
    async query(sql: string, params: any | null = null): Promise<any> {
        try {
            const [rows] = await this.pool.execute(sql, params);
            return rows;
        } catch (error) {
            // Ignore errors, in case new db is down
            console.error(error)
            return []
        }
    }
}

export class ShippingAndHandlingBracket {
    public static HIGHEST_POSSIBLE_WEIGHT = 99999999

    startWeight: number
    endWeight: number
    charge: number

    public static async list(): Promise<ShippingAndHandlingBracket[]> {
        const rows = await New.query("SELECT * FROM shipping_and_handling_brackets", [])
        const result: ShippingAndHandlingBracket[] = []
        for (const row of rows) {
            const bracket = ShippingAndHandlingBracket.fromObject(row)
            if (!bracket)
                continue
            result.push(bracket)
        }
        return result
    }

    /// Throws
    public static async update(oldValue: ShippingAndHandlingBracket, newValue: ShippingAndHandlingBracket) {
        await New.query(`
            UPDATE shipping_and_handling_brackets 
            SET start_weight = ?,
                end_weight = ?,
                charge = ?
            WHERE start_weight = ? AND
                  end_weight = ? AND
                  charge = ?;
        `, [
            newValue.startWeight,
            newValue.endWeight,
            newValue.charge,
            oldValue.startWeight,
            oldValue.endWeight,
            oldValue.charge
        ])
    }

    /// Throws
    public static async addNew(startWeight: number, endWeight: number, charge: number): Promise<ShippingAndHandlingBracket | null> {
        await New.query(`
            INSERT INTO shipping_and_handling_brackets
                (
                    start_weight,
                    end_weight,
                    charge
                )
            VALUES (?, ?, ?)
        `, [startWeight, endWeight, charge])

        return ShippingAndHandlingBracket.get(startWeight, endWeight)
    }

    /// Throws
    public static async get(startWeight: number, endWeight: number): Promise<ShippingAndHandlingBracket | null> {
        const rows = await New.query("SELECT * FROM shipping_and_handling_brackets WHERE start_weight=? AND end_weight=?", [startWeight, endWeight])
        return ShippingAndHandlingBracket.fromObject(rows[0] || {})
    }

    private static fromObject(
        // eslint-disable-next-line
        {start_weight: startWeight, end_weight: endWeight, charge}: any
    ): ShippingAndHandlingBracket | null {
        if (
            typeof startWeight != "number" ||
            typeof endWeight != "number" ||
            typeof charge != "number"
        ) {
            return null
        }
        return new ShippingAndHandlingBracket(startWeight, endWeight, charge)
    }
    
    private constructor(startWeight: number, endWeight: number, charge: number) {
        this.startWeight = startWeight
        this.endWeight = endWeight
        this.charge = charge
    }
}

/// Throws
export async function shippingAndHandlingFor(weight: number): Promise<number> {
    const rows = await New.query("SELECT charge FROM shipping_and_handling_brackets WHERE ? >= start_weight AND ? <= end_weight", [weight, weight])
    console.log(rows)
    if (rows.length <= 0) {
        throw `Could not get shipping and handling charge for order with total weight ${weight}`
    }
    return rows[0].charge
}

export interface OrderWithItems {
    order: Order
    items: {part: Part, quantity: number}[]
}

export class Order {
    id: number
    mailingAddress: string
    customerName: string
    customerEmailAddress: string
    totalPriceCharged: number
    cardAuthorizationCode: string
    status: "authorized" | "shipped"
    datePlaced: Date
    dateShipped: Date
    
    /// Throws, returns the order id
    public static async create(
        mailingAddress: string,
        customer: {
            name: string,
            emailAddress: string
        },
        card: {
            number: string,
            cardholderName: string,
            expiration: {month: number, year: number}
        },
        cartContents: Cart.Item[]
    ): Promise<number> {
        // Validate whether we have enough items in stock, but don't decrease them until the order is shipped. At that point, will need to validate again.
        let items;
        try {
            items = await Part.listByNumber(cartContents.map(e=>e.number))
        } catch (error) {
            throw {isOrderError: true, error: error, userError: "Database error"}
        }
        if (!items) {
            throw {isOrderError: true, error: "Could not find items", userError: "Could not find items"}
        }
        if (cartContents.findIndex(e=>e.quantity > (items.find(p=>p.number==e.number)?.inventoryCount || 0)) != -1) {
            throw {isOrderError: true, error: "Not enough items in stock", userError: "Not enough items in stock"}
        }
        const totalItemPrice = items.reduce<number>((price, item) => price + item.price * (cartContents.find(e=>e.number == item.number)?.quantity || 0), 0)
        const totalWeight = items.reduce<number>((weight, item) => weight + item.weight * (cartContents.find(e=>e.number == item.number)?.quantity || 0), 0)

        let shippingAndHandlingCharges;
        try {
            shippingAndHandlingCharges = await shippingAndHandlingFor(totalWeight)
        } catch (error) {
            throw {isOrderError: true, error: error, userError: "Too many items"}
        }
        
        const totalPrice = Math.round((totalItemPrice + shippingAndHandlingCharges) * 100) / 100

        let cardAuthorizationCode;
        try {
            cardAuthorizationCode = await authorizeTransaction(`Transaction ${Date()}`, card.number, card.cardholderName, card.expiration.month, card.expiration.year, totalPrice)
        // eslint-disable-next-line
        } catch (error: any) {
            throw {isOrderError: true, error: error, userError: "Invalid card info: " + JSON.stringify(error.errors)}
        }
        if (!cardAuthorizationCode) {
            throw {isOrderError: true, error: "Could not authorize credit card", userError: "Could not authorize credit card"}
        }

        try {
            const orderID = (await New.query(
                `INSERT INTO orders (
                    mailing_address,
                    customer_name,
                    customer_email_address,
                    total_price_charged,
                    card_authorization_code
                ) VALUES (?, ?, ?, ?, ?);`,
                [
                    mailingAddress,
                    customer.name,
                    customer.emailAddress,
                    totalPrice,
                    cardAuthorizationCode
                ]
            )).insertId

            // Makes each query in parallel, then waits for them all to be done before returning
            cartContents.map(item => {
                return New.query("INSERT INTO products_in_orders (product_number, order_id, quantity) VALUES (?, ?, ?);", [item.number, orderID, item.quantity])
            }).map(async e=>await e)
            
            sendEmail(
                `Order #${orderID} confirmation`,
                `Hi ${customer.name}!\n\n` +
                `This is confirmation that your order has succesfully been placed!\n\n` +
                `You will recieve an email when it is shipped.\n\n` +
                `You can expect to recieve: ${items.map(
                    item=>{
                        const quantity = cartContents.find(e=>e.number == item.number)?.quantity || 0
                        return `\n\n${quantity} of item #${item.number} (${item.description}) – costing $${(item.price * quantity).toFixed(2)}`
                    }
                )}\n\n` +
                `Subtotal: $${totalItemPrice.toFixed(2)}\n\n` +
                `Shipping and handling: $${shippingAndHandlingCharges.toFixed(2)}\n\n` +
                `Total cost charged: $${totalPrice.toFixed(2)}`,
                customer.emailAddress
            )
            
            return orderID
        } catch (error) {
            throw {isOrderError: true, error: error, userError: "Database error"}
        }
    }

    public static async list(): Promise<Order[] | null> {
        try {
            const rows = await New.query("SELECT * FROM orders;", [])
            if (rows.length <= 0) {
                return []
            }
            const result: Order[] = []
            for (const row of rows) {
                const part = Order.fromObject(row)
                if (!part)
                    continue
                result.push(part)
            }
            return result
        } catch (error) {
            console.error(error)
            return null
        }
    }

    public static async listOfUnshipped(): Promise<Order[] | null> {
        try {
            const rows = await New.query("SELECT * FROM orders WHERE status=\"authorized\";", [])
            if (rows.length <= 0) {
                return []
            }
            const orderList: Order[] = []
            for (const row of rows) {
                const part = Order.fromObject(row)
                if (!part)
                    continue
                orderList.push(part)
            }
            return orderList
        } catch (error) {
            console.error(error)
            return null
        }
    }

    public static async byID(id: number): Promise<Order | null> {
        try {
            const rows = await New.query("SELECT * FROM orders WHERE id=?;", [id])
            if (rows.length != 1) {
                return null
            }
            return Order.fromObject(rows[0])
        } catch (error) {
            console.error(error)
            return null
        }
    }
    
    public static async listWithItems(): Promise<OrderWithItems[] | null> {
        const orderList = await Order.list()
        if (!orderList)
            return null
        const result: OrderWithItems[] = []
        for (const order of orderList) {
            const items = await Part.listFromOrder(order)
            if (!items)
                continue
            result.push({order, items})
        }
        return result
    }

    /// Sets status to shipped and tracks the items as being removed from the inventory
    public async finalize() {
        await New.query("START TRANSACTION")
        try {
            const items = await Part.listFromOrder(this)
            if (items) {
                for (const item of items) {
                    if (item.part.inventoryCount < item.quantity) {
                        throw {canShowUser: true, message: `Item #${item.part.number} (${item.part.description}) only has ${item.part.inventoryCount} in inventory, but order #${this.id} wants ${item.quantity} of them`}
                    }
                    await item.part.addInventory(-1 * item.quantity)
                }
            }
            await New.query("UPDATE orders SET status=\"shipped\", date_shipped=STR_TO_DATE(?, '%Y-%m-%dT%H:%i:%s.%fZ') WHERE id=?", [(new Date()).toISOString(), this.id])
            await New.query("COMMIT")
        } catch (error) {
            console.error("Error in finalizing order!", this, error)
            await New.query("ROLLBACK")
            throw error
        }
    }

    // eslint-disable-next-line
    private static fromObject(obj: any): Order | null {
        if (
            typeof obj.id != "number" ||
            typeof obj.mailing_address != "string" ||
            typeof obj.customer_name != "string" ||
            typeof obj.customer_email_address != "string" ||
            typeof obj.total_price_charged != "number" ||
            typeof obj.card_authorization_code != "string" ||
            !(obj.status == "authorized" || obj.status == "shipped")
        ) {
            return null
        }
        return new Order(
            obj.id,
            obj.mailing_address,
            obj.customer_name,
            obj.customer_email_address,
            obj.total_price_charged,
            obj.card_authorization_code,
            obj.status,
            obj.date_placed,
            obj.date_shipped
        )
    }

    private constructor(
        id: number,
        mailingAddress: string,
        customerName: string,
        customerEmailAddress: string,
        totalPriceCharged: number,
        cardAuthorizationCode: string,
        status: "authorized" | "shipped",
        datePlaced: Date,
        dateShipped: Date,
    ) {
        this.id = id
        this.mailingAddress = mailingAddress
        this.customerName = customerName
        this.customerEmailAddress = customerEmailAddress
        this.totalPriceCharged = totalPriceCharged
        this.cardAuthorizationCode = cardAuthorizationCode
        this.status = status
        this.datePlaced = datePlaced
        this.dateShipped = dateShipped
    }
}

export class Part {
    private static AMOUNT_PER_PAGE = 36
    
    public number: number
    public description: string
    public price: number
    public weight: number
    public pictureURL: string
    public inventoryCount: number

    /// Update a part's inventory count by a give quantity
    public static async addInventory(partNumber: number, quantityToAdd: number): Promise<boolean> {
        // Get the part
        const part = await Part.byNumber(partNumber)
        if (!part) {
            console.error(`Part ${partNumber} not found.`)
            return false
        }
        return await part.addInventory(quantityToAdd)
    }

    public async addInventory(quantityToAdd: number): Promise<boolean> {
        try {
            // Compute the new count
            const newCount = this.inventoryCount + quantityToAdd

            // Update the database
            const result = await New.query(
                "UPDATE products SET count = ? WHERE NUMBER = ?;",
                [newCount, this.number]
            )

            //if the part is not in the new database add it with the new quantity
            if (!result.affectedRows || result.affectedRows === 0) {
                await New.query(
                    "INSERT INTO products (NUMBER, count) VALUES (?, ?);",
                    [
                    this.number,
                    quantityToAdd
                    ]
                )
            }

        } catch (error) {
            console.error(error)
            return false
        }
        return true;
    }

    /// Update a part's inventory count by a give quantity
    public static async subtractInventory(partNumber: number, quantityToSubtract: number): Promise<boolean> {
        try {
            // Get the part
            const part = await Part.byNumber(partNumber)
            if (!part) {
                console.error(`Part ${partNumber} not found.`)
                return false
            }

            // Compute the new count
            const newCount = part.inventoryCount - quantityToSubtract

            // Update the database
            await New.query(
                "UPDATE products SET count = ? WHERE NUMBER = ?;",
                [newCount, partNumber]
            )

            } catch (error) {
            console.error(error)
            return false
        }
        return true;
    }

    
    /// Get a single `Part` given its `number`, by querying the databases
    public static async byNumber(desiredNumber: number): Promise<Part | null> {
        try {
            const legacyRows = await Legacy.query("SELECT * FROM parts WHERE number=?;", [desiredNumber])
            if (legacyRows.length != 1) {
                return null
            }
            const newRows = await New.query("SELECT * FROM products WHERE NUMBER=?", [desiredNumber])
            const amountInInventory = newRows.length >= 1 ? newRows[0].count : 0
            return Part.fromObject(legacyRows[0], amountInInventory)
        } catch(error) {
            console.error(error)
            return null
        }
    }

    /// Get a list of `Part`s for a given page. The first page is page 0
    public static async list(page: number): Promise<Part[] | null> {
        try {
            const legacyRows = await Legacy.query("SELECT * FROM parts LIMIT ? OFFSET ?;", [this.AMOUNT_PER_PAGE, this.AMOUNT_PER_PAGE * page])
            if (legacyRows.length <= 0) {
                return []
            }
            // This is incredibly spooky but it's just generating the proper amount of question marks, it should still be safe
            const newRows = await New.query(
                `SELECT * FROM products WHERE NUMBER IN (${legacyRows.map(()=>'?').join(",")});`,
                legacyRows.map((e:{number:number | undefined})=>e.number).filter((e:number | undefined)=>e===undefined?false:true)
            )
            const result: Part[] = []
            for (const row of legacyRows) {
                // eslint-disable-next-line
                const rowInNewDB = newRows.find((newRow: any) => newRow.number == row.number)
                const amountInInventory = !!rowInNewDB ? rowInNewDB.count : 0
                const part = Part.fromObject(row, amountInInventory)
                if (!part)
                    continue
                result.push(part)
            }
            return result
        } catch (error) {
            console.error(error)
            return null
        }
    }

    /// Get a list of `Part`s that are in a given `Order`.
    public static async listFromOrder(order: Order): Promise<{part: Part, quantity: number}[] | null> {
        try {
            const partsInOrder = await New.query('SELECT product_number, quantity FROM products_in_orders WHERE order_id=?', [order.id])
            // part number to quantity
            const quantities = new Map<number, number>()
            for (const {product_number: partNumber, quantity} of partsInOrder) {
                quantities.set(partNumber, quantity)
            }
            const parts = await Part.listByNumber([...quantities.keys()])
            if (!parts)
                return []
            const result: {part: Part, quantity: number}[] = []
            for (const part of parts) {
                result.push({part: part, quantity: quantities.get(part.number) || 0})
            }
            return result
        } catch (error) {
            console.error(error)
            return null
        }
    }

    /// Get a list of `Part`s for a list of given numbers
    public static async listByNumber(numbers: number[]): Promise<Part[] | null> {
        try {
            // This is incredibly spooky but it's just generating the proper amount of question marks, it should still be safe
            const legacyRows = await Legacy.query(`SELECT * FROM parts WHERE NUMBER IN (${numbers.map(()=>'?').join(",")});`, numbers)
            if (legacyRows.length <= 0) {
                return []
            }
            // This is incredibly spooky but it's just generating the proper amount of question marks, it should still be safe
            const newRows = await New.query(
                `SELECT * FROM products WHERE NUMBER IN (${legacyRows.map(()=>'?').join(",")});`,
                legacyRows.map((e:{number:number})=>e.number).filter((e:number|undefined)=>e===undefined?false:true)
            )
            const result: Part[] = []
            for (const row of legacyRows) {
                // eslint-disable-next-line
                const rowInNewDB = newRows.find((newRow: any) => newRow.number == row.number)
                const amountInInventory = !!rowInNewDB ? rowInNewDB.count : 0
                const part = Part.fromObject(row, amountInInventory)
                if (!part)
                    continue
                result.push(part)
            }
            return result
        } catch (error) {
            console.error(error)
            return null
        }
    }

    /// Create a `Part` from an object, like the kind provided by queries to the legacy database.
    // eslint-disable-next-line
    private static fromObject(obj: any, inventoryCount: number): Part | null {
        const {number, description, price, weight, pictureURL} = obj
        if (!number || !description || !price || !weight || !pictureURL) {
            console.error(`Part from database had missing data: ${number} ${description} ${price} ${weight} ${pictureURL}`)
        }
        // Round the price to the nearest cent
        const roundedPrice = Math.round(price * 100) / 100
        return new Part(number, description, roundedPrice, weight, pictureURL, inventoryCount)
    }
    
    /// Do not use this directly outside of here to create from the database
    private constructor(number: number, description: string, price: number, weight: number, pictureURL: string, inventoryCount: number) {
        this.number = number
        this.description = description
        this.price = price
        this.weight = weight
        this.pictureURL = pictureURL
        this.inventoryCount = inventoryCount
    }
}