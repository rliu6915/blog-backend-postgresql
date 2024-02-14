const jwt = require('jsonwebtoken')
const router = require('express').Router()

const { SECRET } = require('../util/config')
const User = require('../models/user')

router.post('/', async (req, res) => {
  console.log('login', req.body)
  const { username, password } = req.body

  const user = await User.findOne({
    where: {
      username: username,
    }
  })

  const ifPasswordCorrect = password === "secret"

  if (!user || !ifPasswordCorrect) {
    return res.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: username,
    id: user.id,
  }

  const token = jwt.sign(userForToken, SECRET)

  res.status(200).send({
    token,
    username: username,
    name: user.name,
  })
})

module.exports = router