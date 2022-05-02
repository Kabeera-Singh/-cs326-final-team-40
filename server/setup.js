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
    pool.query("CREATE TABLE game(gameguid UUID NOT NULL)").then(() => {
        pool.query(`DROP TABLE IF EXISTS player;`).then(() => {
            pool.query("CREATE TABLE player(playerguid UUID NOT NULL, belongs_to UUID NOT NULL)").then(() => {
                pool.end();
            });
        });
    });
});