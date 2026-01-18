import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { router as v1 } from './infrastructure/http/v1'

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api/v1', v1)

const port = process.env.PORT ?? 3000
app.listen(port, () => {
  console.log(`API escuchando en http://localhost:${port}`)
})
