const router = require('express').Router()

const { Blog } = require('../models')

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  next()
}


app.get('/api/blogs', async (req, res) => {
  // const notes = await sequelize.query("SELECT * FROM notes", {
  //   type: QueryTypes.SELECT
  // })
  const blogs = await Blog.findAll()
  console.log(JSON.stringify(blogs))
  res.json(blogs)
})

app.post('/api/blogs', async (req, res) => {
  // console.log(req.body)
  // const note = await Note.create(req.body)
  // res.json(note)
  try {
    console.log(req.body)
    const blog = await Blog.create(req.body)
    res.json(blog)
  } catch (error) {
    return res.status(400).json({ error })
  }
})

app.delete('/api/blogs/:id', blogFinder, async (req, res) => {
  // const blog = await Blog.findByPk(req.params.id)
  if (req.blog) {
    await req.blog.destroy()
    res.status(200).end()
  } else {
    res.status(404).end()
  }
})