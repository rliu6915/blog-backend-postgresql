const router = require('express').Router()
const jwt = require('jsonwebtoken')
const { Op } = require("sequelize");

const { Note, User } = require('../models')
const { SECRET } = require('../util/config')

const noteFinder = async (req, res, next) => {
  req.note = await Note.findByPk(req.params.id)
  next()
}

router.get('/', async (req, res) => {
  const where = {}
  // const notes = await Note.findAll()
  console.log("req.query: ", req.query)
  // let important = {
  //   // [Op.in]: [true, false]
  //   [Op.or]: {
  //     [Op.in]: [true, false],
  //     [Op.is]: null
  //   }
  // }
  if (req.query.important) {
    where.important = req.query.important === "true"
  }
  if (req.query.search) {
    where.content = {
      [Op.substring]: req.query.search
    }
  }

  const notes = await Note.findAll({
    attributes: {
      exclude: ['userId']
    },
    include: {
      model: User,
      attributes: ["username", 'name']
    },
    // where: {
    //   // important: req.query.important === "true"
    //   // important,
    //   // content: {
    //   //   [Op.substring]: req.query.search ? req.query.search : ""
    //   // }
    // }
    where
  })
  res.json(notes)
})

const tokenExtractor = (req, res, next) => {
  const auhtor = req.get('authorization')
  if (auhtor && auhtor.toLowerCase().startsWith('bearer ')) {
    // req.decodedToken = jwt.verify(auhtor, SECRET)
    try {
      req.decodedToken = jwt.verify(auhtor.substring(7), SECRET)
    } catch (error) {
      return res.status(401).json({ error: 'token invalid'})
    }
  } else {
    return res.status(401).json({ error: 'token missing'})
  }
  next()
}

router.post('/', tokenExtractor, async (req, res) => {
  try {
    // // first user is the only user
    // const user = await User.findOne()
    const user = await User.findByPk(req.decodedToken.id)
    const note = await Note.create({
      ...req.body,
      userId: user.id,
      date: new Date()
    })
    res.json(note)
  } catch(error) {
    return res.status(400).json({ error: 'invalid token'})
  }
})

router.get('/:id', noteFinder, async (req, res) => {
  // const note = await Note.findByPk(req.params.id)
  if (req.note) {
    res.json(req.note)
  } else {
    res.status(404).end()
  }
})

router.delete('/:id', noteFinder, async (req, res) => {
  // const note = await Note.findByPk(req.params.id)
  if (req.note) {
    await req.note.destroy()
  }
  res.status(204).end()
})

router.put('/:id', noteFinder, async (req, res) => {
  // const note = await Note.findByPk(req.params.id)
  if (req.note) {
    req.note.important = req.body.important
    await req.note.save()
    res.json(req.note)
  } else {
    res.status(404).end()
  }
})

module.exports = router