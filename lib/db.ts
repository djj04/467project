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
            const rows = await Legacy.query("SELECT * FROM parts WHERE number=?;", [desiredNumber])
            if (rows.length != 1) {
                return null
            }
            return Part.fromObject(rows[0])
        } catch(error) {
            console.error(error)
            return null
        }
    }

    /// Get a list of `Part`s for a given page. The first page is page 0
    public static async list(page: number): Promise<Part[] | null> {
        try {
            const rows = await Legacy.query("SELECT * FROM parts LIMIT ? OFFSET ?;", [this.AMOUNT_PER_PAGE, this.AMOUNT_PER_PAGE * page])
            if (rows.length <= 0) {
                return []
            }
            let result: Part[] = []
            for (const row of rows) {
                const part = Part.fromObject(row)
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
    private static fromObject(obj: any): Part | null {
        const {number, description, price, weight, pictureURL} = obj
        if (!number || !description || !price || !weight || !pictureURL) {
            console.error(`Part from database had missing data: ${number} ${description} ${price} ${weight} ${pictureURL}`)
        }
        // Round the price to the nearest cent
        const roundedPrice = Math.round(price * 100) / 100
        // TODO: Inventory count. This is from *our new*  db
        return new Part(number, description, roundedPrice, weight, pictureURL, 10)
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