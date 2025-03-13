import postgres from 'postgres'

const sql = postgres('postgres://username:password@localhost:5432/username', {})

export default sql
