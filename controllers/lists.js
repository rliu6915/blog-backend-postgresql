const router = require('express').Router()
const sequelize = require('sequelize')
const { List } = require('../models')

const listFinder = async (req, res, next) => {
  req.lists = await List.findByPk(req.params.id)
  next()
}

// const errorHandler = (error, req, res, next) => {
//   console.log("error.name:", error.name)
//   if (error.name == 'SequelizeValidationError') {
//     return res.status(400).json({ error: error.message })
//   } else if (error.name === 'SequelizeDatabaseError') {
//     return res.status(400).json({ error: error.message })
//   }
//   // return res.status(400).json({ error: error.message })
//   next(error)
// }

router.get('/', async (req, res) => {
  try {
    const lists = await List.findAll()
    res.json(lists)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.get("/:id", listFinder, async (req, res) => {
  try {
    // const lists = await List.findByPk(req.params.id)
    if (req.lists) {
      res.json(req.lists)
    } else {
      res.status(404).end()
    }
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

// // this has to be the last loaded middleware.
// router.use(errorHandler)


module.exports = router