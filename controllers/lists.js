const router = require('express').Router()
const sequelize = require('sequelize')
const { List } = require('../models')

router.get('/', async (req, res) => {
  try {
    const lists = await List.findAll()
    res.json(lists)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.post('/', async (req, res) => {
  try {
      // const user = await User.findByPk(req.decodedToken.id)
    const list = await List.create(req.body)
    res.json(list)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})


module.exports = router