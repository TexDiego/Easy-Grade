import { Pool } from "pg";

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "grade_db",
  password: "1710",
  port: 5432,
});

export default pool;