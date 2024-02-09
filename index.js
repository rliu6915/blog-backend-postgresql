// require('dotenv').config()
// const { Sequelize, QueryTypes, DataTypes, Model } = require('sequelize')

// const express = require('express')
// const app = express()

// const sequelize = new Sequelize(process.env.DATABASE_URL)

// // const main = async () => {
// //   try {
// //     await sequelize.authenticate()
// //     // console.log('Connection has been established successfully.')
// //     const notes = await sequelize.query("SELECT * FROM notes", {
// //       type: QueryTypes.SELECT
// //     })
// //     console.log(notes)
// //     sequelize.close()
// //   } catch (error) {
// //     console.error('Unable to connect to the database:', error)
// //   }
// // }

// // main()

// class Note extends Model {}
// Note.init({
//   id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true
//   },
//   content: {
//     type: DataTypes.TEXT,
//     allowNull: false
//   },
//   important: {
//     type: DataTypes.BOOLEAN,
//   },
//   date: {
//     type: DataTypes.DATE,
//   },
//   // creationYear: {
//   //   type: DataTypes.INTEGER,
//   // }
// }, {
//   sequelize,
//   underscored: true,
//   timestamps: false,
//   modelName: 'note'
// })

// class Blog extends Model {}
// Blog.init({
//   id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true
//   },
//   author: {
//     type: DataTypes.TEXT,
//   },
//   uri: {
//     type: DataTypes.TEXT,
//     allowNull: false
//   },
//   title: {
//     type: DataTypes.TEXT,
//     allowNull: false
//   },
//   likes: {
//     type: DataTypes.INTEGER,
//     defaultValue: 0
//   }
// }, {
//   sequelize,
//   underscored: true,
//   timestamps: false,
//   modelName: 'blog'
// })

// Note.sync()
// Blog.sync()

// app.use(express.json())

// app.get('/api/notes', async (req, res) => {
//     // const notes = await sequelize.query("SELECT * FROM notes", {
//     //   type: QueryTypes.SELECT
//     // })
//     const notes = await Note.findAll()
//     console.log(JSON.stringify(notes))
//     res.json(notes)
// })

// app.get('/api/blogs', async (req, res) => {
//   // const notes = await sequelize.query("SELECT * FROM notes", {
//   //   type: QueryTypes.SELECT
//   // })
//   const blogs = await Blog.findAll()
//   console.log(JSON.stringify(blogs))
//   res.json(blogs)
// })

// app.get('/api/notes/:id', async (req, res) => {
//   const note = await Note.findByPk(req.params.id)
//   if (note) {
//     console.log(note.toJSON())
//     res.json(note)
//   } else {
//     res.status(404).end()
//   }
// })

// app.post('/api/notes', async (req, res) => {
//   // console.log(req.body)
//   // const note = await Note.create(req.body)
//   // res.json(note)
//   try {
//     console.log(req.body)
//     const note = await Note.create(req.body)
//     res.json(note)
//   } catch (error) {
//     return res.status(400).json({ error })
//   }
// })

// app.post('/api/blogs', async (req, res) => {
//   // console.log(req.body)
//   // const note = await Note.create(req.body)
//   // res.json(note)
//   try {
//     console.log(req.body)
//     const blog = await Blog.create(req.body)
//     res.json(blog)
//   } catch (error) {
//     return res.status(400).json({ error })
//   }
// })

// app.put('/api/notes/:id', async (req, res) => {
//   const note = await Note.findByPk(req.params.id)
//   if (note) {
//     note.important = req.body.important
//     await note.save()
//     res.json(note)
//   } else {
//     res.status(404).end()
//   }
// })

// app.delete('/api/blogs/:id', async (req, res) => {
//   const blog = await Blog.findByPk(req.params.id)
//   if (blog) {
//     await blog.destroy()
//     res.status(200).end()
//   } else {
//     res.status(404).end()
//   }
// })

// const PORT = process.env.PORT || 3000
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`)
// })

const express = require('express')
require('express-async-errors')
const app = express()

const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')

const notesRouter = require('./controllers/notes')
const blogsRouter = require('./controllers/blogs')

app.use(express.json())

app.use('/api/notes', notesRouter)
app.use('/api/blogs', blogsRouter)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()