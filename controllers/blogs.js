const router = require('express').Router()
const { Blog, User } = require('../models')
const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')
const { Op } = require('sequelize')

const { tokenExtractor } = require('../util/middleware')


const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  next()
}

const errorHandler = (error, req, res, next) => {
  console.log("error.name:", error.name)
  if (error.name == 'SequelizeValidationError') {
    return res.status(400).json({ error: error.message })
  } else if (error.name === 'SequelizeDatabaseError') {
    return res.status(400).json({ error: error.message })
  }
  next(error)
}


router.get('/', async (req, res) => {
  // const notes = await sequelize.query("SELECT * FROM notes", {
  //   type: QueryTypes.SELECT
  // })
  const where = {}
  console.log('req.query', req.query.search)
  if (req.query.search) {
    where[Op.or] = [
      {
        title: {
          [Op.iLike]: `%${req.query.search}%`
        }
      },
      {
        author: {
          [Op.iLike]: `%${req.query.search}%`
        }
      }
    ]
    // where.title = {
    //   // [Op.substring]: req.query.search
    //   [Op.iLike]: `%${req.query.search}%`
    // },
    // where.author = {
    //   // [Op.substring]: req.query.search
    //   [Op.iLike]: `%${req.query.search}%`
    // }
  }
  const blogs = await Blog.findAll({
    attributes: {
      exclude: ["userId"]
    },
    include: {
      model: User,
      attributes: ["username", "name"]
    },
    where,
    order: [
      ['likes', 'DESC']
    ]
  })
  // console.log(JSON.stringify(blogs))
  res.json(blogs)
})

// const tokenExtractor = (req, res, next) => {
//   // console.log('Token extractor', req)
//   const auhtor = req.get('authorization')
//   if (auhtor && auhtor.toLowerCase().startsWith('bearer ')) {
//     // req.decodedToken = jwt.verify(auhtor, SECRET)
//     try {
//       req.decodedToken = jwt.verify(auhtor.substring(7), SECRET)
//     } catch (error) {
//       return res.status(401).json({ error: 'token invalid'})
//     }
//   } else {
//     return res.status(401).json({ error: 'token missing'})
//   }
//   next()
// }

router.post('/', tokenExtractor, async (req, res) => {
  // console.log(req.body)
  // const note = await Note.create(req.body)
  // res.json(note)
  // try {
  //   // console.log(req.body)
  //   const blog = await Blog.create(req.body)
  //   res.json(blog)
  // } catch (error) {
  //   // return res.status(400).json({ error })
  //   next(error)
  // }

  // console.log("decodedToken: ", req.decodedToken)
  const user = await User.findByPk(req.decodedToken.id)
  const blog = await Blog.create({
    ...req.body,
    userId: user.id
  })
  res.json(blog)
})

router.put('/:id', blogFinder, async (req, res) => {
  // if (req.blog) {
  //   req.blog.likes = req.body.likes
  //   await req.blog.save()
  //   res.json(req.blog)
  // } else {
  //   res.status(404).end()
  // }
  // try {
  //   if (req.blog) {
  //     req.blog.likes = req.body.likes
  //     await req.blog.save()
  //     res.json(req.blog)
  //   } else {
  //     res.status(404).end()
  //   }
  // } catch(error) {
  //   next(error)
  // }
  if (req.blog) {
    req.blog.likes = req.body.likes
    await req.blog.save()
    res.json(req.blog)
  } else {
    res.status(404).end()
  }
})

router.delete('/:id', blogFinder, tokenExtractor, async (req, res) => {
  // const blog = await Blog.findByPk(req.params.id)
  console.log("decodedToken: ", req.decodedToken)
  if (req.blog) {
    await req.blog.destroy()
    res.status(200).end()
  } else {
    res.status(404).end()
  }
})

// this has to be the last loaded middleware.
router.use(errorHandler)

module.exports = router