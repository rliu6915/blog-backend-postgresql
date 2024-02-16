const Note = require('./note')
const Blog = require('./blog')
const User = require('./user')

// Note.sync()
// Blog.sync()
// User.sync()

User.hasMany(Note, {
  onDelete: 'cascade',
  onUpdate: 'cascade'
})
Note.belongsTo(User)
User.hasMany(Blog, {
  onDelete: 'cascade',
  onUpdate: 'cascade'
})
Blog.belongsTo(User)
Note.sync({
  alter: true
})
Blog.sync({
  alter: true
})
User.sync({
  alter: true
})


module.exports = {
  Note,
  Blog,
  User,
}