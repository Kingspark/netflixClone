import mysql from 'mysql2/promise'

// Pool is created lazily on first use so env vars are guaranteed to be
// loaded by the time createPool() reads process.env.MYSQL_* values.
let _pool = null

function getPool() {
  if (!_pool) {
    _pool = mysql.createPool({
      host: process.env.MYSQL_HOST ?? '127.0.0.1',
      port: Number(process.env.MYSQL_PORT) || 3306,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      connectionLimit: Number(process.env.MYSQL_CONNECTION_LIMIT) || 10,
      waitForConnections: true,
      ssl: process.env.MYSQL_HOST && process.env.MYSQL_HOST !== 'localhost'
        ? { rejectUnauthorized: false }
        : undefined,
    })
  }
  return _pool
}

// Proxy object so callers use `pool.execute(...)` as before
const pool = {
  execute: (...args) => getPool().execute(...args),
  query: (...args) => getPool().query(...args),
}

export default pool
