const router = require('express').Router()
const bcrypt = require('bcrypt')

const { User, Note, Blog } = require('../models')

const errorHandler = (error, req, res, next) => {
  console.log("error.name: ", error.name)
  if (error.name === "SequelizeValidationError") {
    return res.status(400).json({
      error: "Validation isEmail on username failed"
    })
  }
  next(error)
}

router.get('/', async (req, res) => {
  // const users = await User.findAll()
  // const users = await User.findAll({
  //   include: {
  //     model: Note,
  //   }
  // })
  const users = await User.findAll({
    // include: {
    //   model: Note,
    //   attributes: {
    //     exclude: ['userId']
    //   }
    // },
    include: [
      {
        model: Note,
        attributes: {
          exclude: ['userId']
        }
      },
      {
        model: Blog,
        attributes: {
          exclude: ['userId']
        }
      }
    ]
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
  const { username, name, password } = req.body
  // try {
  //   const passwordHash = await bcrypt.hash(password, 10)
  //   const user = await User.create({
  //     username,
  //     name,
  //     passwordHash
  //   })
  //   res.json(user)
  // } catch (error) {
  //   res.status(400).json(error)
  // } 
  const passwordHash = await bcrypt.hash(password, 10)
  const user = await User.create({
    username,
    name,
    passwordHash
  })
  res.json(user)
})

router.put('/:username', async (req, res) => {
  const { username } = req.params

  const user = await User.findOne({
    where: {
      username
    }
  })

  if (!user) {
    return res.status(404).end()
  }

  await user.update({
    username: req.body.username
  })
  res.status(204).end()
})

router.delete('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id)
  if (!user) {
    return res.status(404).end()
  } 
  await user.destroy()
  res.status(204).end()
})

router.use(errorHandler)

module.exports = router