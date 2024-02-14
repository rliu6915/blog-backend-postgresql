const router = require('express').Router()

const { User, Note } = require('../models')

router.get('/', async (req, res) => {
  // const users = await User.findAll()
  const users = await User.findAll({
    include: {
      model: Note,
    }
  })
  res.json(users)
})

router.get('/:id', async (req, res) => {
  console.log(req)
  const user = await User.findByPk(req.params.id)
  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})

router.post('/', async (req, res) => {
  console.log(req.body)
  try {
    const user = await User.create(req.body)
    res.json(user)
  } catch (error) {
    res.status(400).json(error)
  } 
})

module.exports = router