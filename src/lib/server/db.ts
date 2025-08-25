import postgres from 'postgres'

const sql = postgres('postgres://postgres:secret@localhost:5432/configzero', {})

export default sql
