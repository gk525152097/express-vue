const Sequelize = require('sequelize')
const sequelize = require('../utils/sequelize')

const User = sequelize.define('user', {
  uuid: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  username: {
    type: Sequelize.STRING,
    unique: true
  },
  password: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING,
    unique: true
  },
  mobilePhoneNumber: {
    type: Sequelize.STRING,
    unique: true
  },
  roles: {
    type: Sequelize.JSON
  }
})

User.sync()

module.exports = User
