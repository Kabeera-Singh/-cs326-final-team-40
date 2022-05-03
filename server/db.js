import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// const query = (text, params) => pool.query(text, params);

function queryPromise(text, params) {
    return new Promise((resolve, reject) => {
        pool.connect((err, client, done) => {
            if (err) {
                done();
                reject(err);
            }
            const handleError = (err) => {
                if (err) {
                    console.log(err);
                    client.query('ROLLBACK', (err) => {
                        if (err) {
                            console.log(err);
                        }
                    });
                }
                done();
                reject(err);
            }
            client.query(text, params, (err, result) => {
                if (err) {
                    handleError(err);
                    reject(err);
                }
                client.query('COMMIT', (err) => {
                    if (err) {
                        console.log(err);
                        handleError(err);
                    }
                });
                done();
                resolve(result);
            });
        });
    });
}

export { queryPromise };