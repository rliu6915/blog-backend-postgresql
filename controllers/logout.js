const { User } = require('../models')
const Session = require('../models/session')
const { tokenExtractor } = require('../util/middleware')

const router = require('express').Router()

const userFind = async (req, res, next) => {
  req.user = await User.findOne({
    where: {
      username: req.params.username
    }
  })
  next()
} 

router.delete('/', userFind, tokenExtractor, async (req, res) => {
  if (req.user) {
    await Session.destroy({
      where: {
        user_id: req.user.id
      }
    })
    res.status(204).json({
      message: "logged out and session deleted"
    })
  } else {
    res.status(404).end()
  }
})

module.exports = router