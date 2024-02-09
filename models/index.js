const Note = require('./note')
const Blog = require('./blog')
const User = require('./user')

Note.sync()
Blog.sync()
User.sync()


module.exports = {
  Note,
  Blog,
  User,
}