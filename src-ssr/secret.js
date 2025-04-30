import dotenv from 'dotenv'
dotenv.config()

const secretKey = process.env.SECRET_KEY
const refreshSecretKey = process.env.REFRESH_SECRET_KEY

export default { secretKey, refreshSecretKey }
