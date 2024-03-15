const router = require('express').Router()
const sequelize = require('sequelize')
const { List } = require('../models')
const { tokenExtractor } = require('../util/middleware')

const listFinder = async (req, res, next) => {
  req.lists = await List.findByPk(req.params.id)
  next()
}

// const tokenExtractor = (req, res, next) => {
//   const auhtor = req.get('authorization')
//   if (auhtor && auhtor.toLowerCase().startsWith('bearer ')) {
//     // req.decodedToken = jwt.verify(auhtor, SECRET)
//     try {
//       req.decodedToken = jwt.verify(auhtor.substring(7), SECRET)
//     } catch (error) {
//       next(error)
//     }
//   }
//   next()
// }

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

router.put('/:id', listFinder, tokenExtractor, async (req, res) => {
  try {
    // const list = await List.findByPk(req.params.id)
    if (req.lists) {
      req.lists.readState = req.body.read
      // await req.lists.update(req.body)
      res.json(req.lists)
    } else {
      res.status(404).end()
    }
  } catch (error) {
    res.status(400).json({ error: error.message })
  }

})

// // this has to be the last loaded middleware.
// router.use(errorHandler)


module.exports = router