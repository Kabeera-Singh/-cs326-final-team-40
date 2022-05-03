import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
})

pool.query(`DROP TABLE IF EXISTS game;`).then(() => {
    pool.query("CREATE TABLE game(gameguid char(21) NOT NULL)").then(() => {
        pool.query(`DROP TABLE IF EXISTS player;`).then(() => {
            pool.query("CREATE TABLE player(playerguid char(21), name varchar(30) NOT NULL, belongs_to char(21) NOT NULL, word varchar(50) NOT NULL, canvas text, guesses varchar(30)[] NOT NULL)").then(() => {
                pool.end();
            });
        });
    });
});