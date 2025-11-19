import mysql from 'mysql2/promise';
import { Cart } from './cart';
import { authorizeTransaction } from './authorizeCard';

namespace Legacy {
    /// Throws
    export async function query(sql: string, params: any | null = null): Promise<any> {
        const connection = await mysql.createConnection ({
            host: 'blitz.cs.niu.edu',
            user: 'student',
            password: 'student',
            database: 'csci467',
            port: 3306,
            ssl: {
                //TODO: Use system ca
                rejectUnauthorized: false
            }
        });

        const [rows] = await connection.execute(sql, params);
        await connection.end();
        return rows;
    }
}

namespace New {
    export async function query(sql: string, params: any | null = null): Promise<any> {
        try {
            //TODO: ssl?
            const connection = await mysql.createConnection ({
                host: process.env.NEW_DB_HOST || "No value for environment variable NEW_DB_HOST, check .env.local in the root of the project",
                user: process.env.NEW_DB_USER || "No value for environment variable NEW_DB_USER, check .env.local in the root of the project",
                password: process.env.NEW_DB_PASSWORD || "No value for environment variable NEW_DB_PASSWORD, check .env.local in the root of the project",
                database: process.env.NEW_DB_DATABASE || "No value for environment variable NEW_DB_DATABASE, check .env.local in the root of the project",
                port: parseInt(process.env.NEW_DB_PORT || "3306")
            });

            const [rows] = await connection.execute(sql, params);
            await connection.end();
            return rows;
        } catch (error) {
            // Ignore errors, in case new db is down
            console.error(error)
            return []
        }
    }
}

export class ShippingAndHandlingBracket {
    public static HIGHEST_POSSIBLE_WEIGHT = 99.98999786376953

    startWeight: number
    endWeight: number
    charge: number

    public static async list(): Promise<ShippingAndHandlingBracket[]> {
        const rows = await New.query("SELECT * FROM shipping_and_handling_brackets", [])
        let result: ShippingAndHandlingBracket[] = []
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
    
    /// Throws
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
    ) {
        // Validate whether we have enough items in stock, but don't decrease them until the order is shipped. At that point, will need to validate again.
        const items = await Part.listByNumber(cartContents.map(e=>e.number))
        if (!items) {
            throw "Could not find items"
        }
        if (cartContents.findIndex(e=>e.quantity > (items.find(p=>p.number==e.number)?.inventoryCount || 0)) != -1) {
            throw "Not enough items in stock"
        }
        const totalItemPrice = items.reduce<number>((price, item) => price + item.price * (cartContents.find(e=>e.number == item.number)?.quantity || 0), 0)
        const totalWeight = items.reduce<number>((weight, item) => weight + item.weight * (cartContents.find(e=>e.number == item.number)?.quantity || 0), 0)

        const shippingAndHandlingCharges = await shippingAndHandlingFor(totalWeight)
        
        const totalPrice = Math.round((totalItemPrice + shippingAndHandlingCharges) * 100) / 100

        const cardAuthorizationCode = await authorizeTransaction(`Transaction ${Date()}`, card.number, card.cardholderName, card.expiration.month, card.expiration.year, totalPrice)
        if (!cardAuthorizationCode) {
            throw "Could not authorize credit card"
        }

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
    }

    public static async list(): Promise<Order[] | null> {
        try {
            const rows = await New.query("SELECT * FROM orders;", [])
            if (rows.length <= 0) {
                return []
            }
            let result: Order[] = []
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
        try {
            // Get the part
            const part = await Part.byNumber(partNumber)
            if (!part) {
                console.error(`Part ${partNumber} not found.`)
                return false
            }

            // Compute the new count
            const newCount = part.inventoryCount + quantityToAdd

            // Update the database
            const result = await New.query(
                "UPDATE products SET count = ? WHERE NUMBER = ?;",
                [newCount, partNumber]
            )

            //if the part is not in the new database add it with the new quantity
            if (!result.affectedRows || result.affectedRows === 0) {
                await New.query(
                    "INSERT INTO products (NUMBER, count) VALUES (?, ?);",
                    [
                    part.number,
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
            const result = await New.query(
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
                legacyRows.map((e:any)=>e.number).filter((e:number)=>e===undefined?false:true)
            )
            let result: Part[] = []
            for (const row of legacyRows) {
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
            let result: {part: Part, quantity: number}[] = []
            for (const {product_number: partId, quantity} of await New.query('SELECT product_number, quantity FROM products_in_orders WHERE order_id=?', [order.id])) {
                const part = await Part.byNumber(partId)
                if (!part)
                    continue
                result.push({part: part, quantity})
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
                legacyRows.map((e:any)=>e.number).filter((e:number)=>e===undefined?false:true)
            )
            let result: Part[] = []
            for (const row of legacyRows) {
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