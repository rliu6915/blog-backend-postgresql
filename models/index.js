const Note = require('./note')
const Blog = require('./blog')
const User = require('./user')

const Team = require('./team')
const Membership = require('./membership')
const UserNotes = require('./user_note')

const List = require('./list')
const Session = require('./session')

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

User.belongsToMany(Note, {
  through: UserNotes,
  as: "marked_notes"
})
Note.belongsToMany(User, {
  through: UserNotes,
  as: "marked_users"
})

User.belongsToMany(Blog, {
  through: List,
  as: "readings"
})
Blog.belongsToMany(User, {
  through: List,
  as: "reading_lists"
})

User.hasMany(Session)
Session.belongsTo(User)


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
  Membership,
  UserNotes,
  List,
  Session
}