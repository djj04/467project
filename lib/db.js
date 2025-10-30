import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

const sslCert = fs.readFileSync(path.join(process.cwd(), 'certs', 'client-cert.pem'));

export async function query(sql, params) {
    const connection = await mysql.createConnection ({
        host: 'blitz.cs.niu.edu',
        user: 'student',
        password: 'student',
        database: 'csci467',
        port: 3306,
        ssl: {
            ca: sslCert
        }
    });

    const [rows] = await connecction.execute(sql, params);
    await connection.end();
    return rows;
}