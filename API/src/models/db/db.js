const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
});

module.exports = {
  query: (text, params, callback) => pool.query(text, params, callback),

  exists: async (tableName) => {
	const queryText = `
	  SELECT EXISTS (
		SELECT 1
		FROM   information_schema.tables
		WHERE  table_name = $1
	  );
	`;
  
	const result = await pool.query(queryText, [tableName]);
	return result.rows[0].exists;
  },

  // add select
};