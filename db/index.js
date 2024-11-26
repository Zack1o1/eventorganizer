import { configDotenv } from 'dotenv'
import pg from 'pg'

const { Client } = pg

configDotenv()

const dbConfig = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST, 
    database: process.env.DB_NAME, 
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
}
const client = new Client(dbConfig)

client
    .connect()
    .then(()=> console.log('Connected to database'))
    .catch((err)=> console.error('Error connecting to database', err))

export default client