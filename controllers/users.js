const router = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")

const { User, Note, Blog, Team, List } = require('../models')
const { SECRET } = require('../util/config')
const { tokenExtractor } = require("../util/middleware")

const errorHandler = (error, req, res, next) => {
  // console.log("error.name: ", error.name)
  if (error.name === "SequelizeValidationError") {
    return res.status(400).json({
      error: error.message
    })
  } else if (error.name == "SequelizeDatabaseError") {
    return res.status(400).json({
      error: error.message
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
      },
      {
        model: Team,
        attributes: ['name', 'id'],
        through: {
          attributes: []
        }
      }
    ]
  })
  res.json(users)
})

router.get('/:id', async (req, res) => {
  // console.log(req)
  // const user = await User.findByPk(req.params.id)
  // const user = await User.findByPk(req.params.id, {
  //   include: {
  //     model: Note
  //   }
  // })
  const user = await User.findByPk(req.params.id, {
    attributes: {
      exclude: [''],
    },
    include: [
      {
        model: Note,
        attributes: {
          exclude: ['userId']
        }
      },
      {
        model: Note,
        as: "marked_notes",
        attributes: {
          exclude: ['userId']
        },
        through: {
          attributes: []
        },
        include: {
          model: User,
          attributes: ['name']
        }
      },
      {
        model: Team,
        attributes: ['name', 'id'],
        through: {
          attributes: []
        }
      }, 
      {
        model: Blog,
        as : "readings",
        attributes: {
          exclude: ['userId', 'createdAt', 'updatedAt']
        },
        through: {
          attributes: []
        },
      }
    ]
  })

  // user.notes.forEach(note => {
  //   console.log(note.content)
  // })

  if (user) {
    // user.note_count = user.notes.length
    // delete user.notes
    // console.log(user)
    res.json(user)
    // res.json({
    //   username: user.username,
    //   name: user.name,
    //   note_count: user.notes.length
    // })
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
  // console.log("passwordHash: ", passwordHash)
  const user = await User.create({
    username,
    name,
    passwordHash
  })
  res.json(user)
})

// const tokenExtractor = (req, res, next) => {
//   const auhtor = req.get('authorization')
//   if (auhtor && auhtor.toLowerCase().startsWith("bearer ")) {
//     try {
//       req.decodedToken = jwt.verify(auhtor.substring(7), SECRET)
//     } catch (error) {
//       return res.status(401).json({ error: "token invalid"})
//     }
//   } else {
//     return res.status(401).json({ error: "token missing"})
//   }
//   next()
// }

const isAdmin = async (req, res, next) => {
  const user = await User.findByPk(req.decodedToken.id)
  if (!user.admin) {
    return res.status(401).json({ error: "user is not admin "})
  }
  next()
}

router.put('/:username', tokenExtractor, isAdmin, async (req, res) => {
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
    username: req.body.username,
    disabled: req.body.disabled
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