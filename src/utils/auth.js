import config from '../config'
import { User } from '../resources/user/user.model'
import jwt from 'jsonwebtoken'

const TOKEN_PREFIX = 'Bearer '

export const newToken = user => {
  return jwt.sign({ id: user.id }, config.secrets.jwt, {
    expiresIn: config.secrets.jwtExp
  })
}

export const verifyToken = token =>
  new Promise((resolve, reject) => {
    jwt.verify(token, config.secrets.jwt, (err, payload) => {
      if (err) return reject(err)
      resolve(payload)
    })
  })

export const signup = async (req, res) => {
  const email = req.body.email
  const password = req.body.password
  if (email && email.includes('@') && password && password.length > 6) {
    const user = await User.create({ email: email, password: password })
    const token = await newToken(user)
    return res.status(201).send({ token: token })
  } else {
    return res.status(400).send({ message: 'requires email and password' })
  }
}

export const signin = async (req, res) => {
  const email = req.body.email
  const password = req.body.password

  if (!email || !password) {
    return res.status(400).send({ message: 'Your password or email is wrong' })
  }

  const user = await User.findOne({ email: email }).exec()

  if (user) {
    try {
      const match = await user.checkPassword(password)

      if (!match) {
        return res
          .status(401)
          .send({ message: 'Your password or email is wrong' })
      }
    } catch (err) {
      return res
        .status(401)
        .send({ message: 'Your password or email is wrong' })
    }
  } else {
    return res.status(401).send({ message: 'Your password or email is wrong' })
  }

  const jwt = newToken(user)
  return res.status(201).send({ token: jwt })
}

const getTokenFromHeaders = req => {
  return req.headers.authorization
}

const isTokenVaild = token => {
  if (token) {
    return token.startsWith(TOKEN_PREFIX)
  } else {
    return false
  }
}

const extractJwtFromToken = token => {
  return token.substr(TOKEN_PREFIX.length)
}

export const protect = async (req, res, next) => {
  const token = getTokenFromHeaders(req)

  if (!isTokenVaild(token)) {
    return res.status(401).end()
  }

  const jwt = await extractJwtFromToken(token)

  try {
    const userId = await verifyToken(jwt)
    const user = await User.findById({ _id: userId.id })
      .select('-password')
      .lean()
      .exec()
    if (!user) {
      return res.status(401).end()
    } else {
      req.user = user
    }
  } catch (e) {
    console.error(e)
    return res.status(401).end()
  }
  next()
}
