const router = require('express').Router()
const sequelize = require('sequelize')

router.post('/', async (req, res) => {
  // const user = await User.findByPk(req.decodedToken.id)
  // const blog = await Blog.create({
  //   ...req.body,
  //   userId: user.id
  // })
  // res.json(blog)
})

module.exports = router