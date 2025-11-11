import mysql from 'mysql2/promise';

export async function query(sql, params) {
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