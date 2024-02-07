const router = require('express').Router()

const { error } = require('console')
const { Blog } = require('../models')

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  next()
}

const errorHandler = (error, req, res, next) => {
  console.log(error.message)
  if (error.name === 'CastError') {
    return res.status(400).json({ error: error.message })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }
  next(error)
}


router.get('/', async (req, res) => {
  // const notes = await sequelize.query("SELECT * FROM notes", {
  //   type: QueryTypes.SELECT
  // })
  const blogs = await Blog.findAll()
  console.log(JSON.stringify(blogs))
  res.json(blogs)
})

router.post('/', async (req, res, next) => {
  // console.log(req.body)
  // const note = await Note.create(req.body)
  // res.json(note)
  try {
    console.log(req.body)
    const blog = await Blog.create(req.body)
    res.json(blog)
  } catch (error) {
    // return res.status(400).json({ error })
    next(error)
  }
})

router.put('/:id', blogFinder, async (req, res, next) => {
  // if (req.blog) {
  //   req.blog.likes = req.body.likes
  //   await req.blog.save()
  //   res.json(req.blog)
  // } else {
  //   res.status(404).end()
  // }
  try {
    if (req.blog) {
      req.blog.likes = req.body.likes
      await req.blog.save()
      res.json(req.blog)
    } else {
      res.status(404).end()
    }
  } catch {
    next(error)
  }
})

router.delete('/:id', blogFinder, async (req, res) => {
  // const blog = await Blog.findByPk(req.params.id)
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