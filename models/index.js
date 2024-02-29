const Note = require('./note')
const Blog = require('./blog')
const User = require('./user')

const Team = require('./team')
const Membership = require('./membership')

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

User.belongsToMany(Team, { through: Membership })
Team.belongsToMany(User, { through: Membership })

// Note.sync({
//   alter: true
// })
// Blog.sync({
//   alter: true
// })
// User.sync({
//   alter: true
// })


module.exports = {
  Note,
  Blog,
  User,
  Team,
  Membership
}