const router = require('express').Router()
const Blog = require('../models/blog')
const sequelize = require('sequelize')

router.get('/', async (req, res) => {
  const author = await Blog.findAll({
    attributes: [
      'author',
      [sequelize.fn('COUNT', sequelize.col('*')), 'articles'],
      [sequelize.fn('SUM', sequelize.col('likes')), 'likes'],
    ],
    group: "author",
})
  console.log('The get method in authors: ', JSON.stringify(author))
  res.json(author)
})

module.exports = router