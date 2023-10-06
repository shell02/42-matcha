import { Pool, QueryResult } from 'pg'

const port: number = process.env.POSTGRES_PORT
  ? parseInt(process.env.POSTGRES_PORT)
  : 5432

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: port,
})

export class mainDB {
  async query(text: string, params?: unknown[]) {
    return pool.query(text, params)
  }

  async queryCB(
    text: string,
    params: unknown[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callback: (err: Error, result: QueryResult<any>) => void,
  ) {
    return pool.query(text, params, callback)
  }

  async exists(tableName: string): Promise<boolean> {
    const queryText = ` SELECT EXISTS (
      SELECT * FROM 
          pg_tables
          WHERE
            schemaname = 'public' AND
            tablename = '${tableName}'
      )
      `

    const result = await pool.query(queryText)
    return result.rows[0].exists
  }
}
