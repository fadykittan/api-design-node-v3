import express from 'express'
import { json, urlencoded } from 'body-parser'
import morgan from 'morgan'
import cors from 'cors'

export const app = express()

app.disable('x-powered-by')

app.use(cors())
app.use(json())
app.use(urlencoded({ extended: true }))
app.use(morgan('dev'))

const router = express.Router()

router.get('/me', (req, res) => {
  res.send({ me: 'Okay' })
})

app.use('/api', router)

// const log = (req, res, next) => {
//   console.log('New request is coming')
//   next()
// }

// app.use(log)

app.get('/', (req, res) => {
  res.send({ message: 'Hello' })
})

app.post('/', (req, res) => {
  console.log(req.body)
  res.send({ message: 'Ok' })
})

export const start = () => {
  app.listen(3000, () => {
    console.log(`Server Started on port 3000`)
  })
}
