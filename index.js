require('dotenv').config()
const { Sequelize, QueryTypes, DataTypes, Model } = require('sequelize')

const express = require('express')
const app = express()

const sequelize = new Sequelize(process.env.DATABASE_URL)

// const main = async () => {
//   try {
//     await sequelize.authenticate()
//     // console.log('Connection has been established successfully.')
//     const notes = await sequelize.query("SELECT * FROM notes", {
//       type: QueryTypes.SELECT
//     })
//     console.log(notes)
//     sequelize.close()
//   } catch (error) {
//     console.error('Unable to connect to the database:', error)
//   }
// }

// main()

class Note extends Model {}
Note.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  important: {
    type: DataTypes.BOOLEAN,
  },
  date: {
    type: DataTypes.DATE,
  },
  // creationYear: {
  //   type: DataTypes.INTEGER,
  // }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'note'
})

Note.sync()

app.use(express.json())

app.get('/api/notes', async (req, res) => {
    // const notes = await sequelize.query("SELECT * FROM notes", {
    //   type: QueryTypes.SELECT
    // })
    const notes = await Note.findAll()
    res.json(notes)
})

app.post('/api/notes', async (req, res) => {
  // console.log(req.body)
  // const note = await Note.create(req.body)
  // res.json(note)
  try {
    console.log(req.body)
    const note = await Note.create(req.body)
    res.json(note)
  } catch (error) {
    return res.status(400).json({ error })
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})