import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

pool.connect()
  .then(client => {
    console.log('✅ PostgreSQL connected');
    client.release();
  })
  .catch(err => {
    console.log('❌ PostgreSQL connection error:', err);
  });
  
class Database {
  query(text, param) {
    try {
      return pool.query(text, param);
    } catch (err) {
      return err;
    }
  }
}

export default Database;