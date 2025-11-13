import mysql from 'mysql2/promise';

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

export class Part {
    private static AMOUNT_PER_PAGE = 36
    
    public number: number
    public description: string
    public price: number
    public weight: number
    public pictureURL: string
    public inventoryCount: number

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