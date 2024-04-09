const jwt = require('jsonwebtoken')
const { SECRET } = require('./config.js')
const Session = require('../models/session.js')
const User = require('../models/user.js')

const sessionFind = async (token) => {
  return await Session.findOne({
    where: {
      token
    },
    include: {
      model: User
    }
  })
}

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
      const session = sessionFind(req.decodedToken)
      if (!session) {
        return res.status(401).json({ error: 'token invalid' })
      }
      if (session.user.disabled) {
        return res.status(401).json({ error: 'user disabled' })
      }
      req.user = session.user
    } catch{
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

module.exports = { tokenExtractor }