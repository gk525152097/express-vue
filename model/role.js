const Sequelize = require('sequelize')
const sequelize = require('../utils/sequelize')

const Role = sequelize.define('role', {
  uuid: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    unique: true
  },
  description: {
    type: Sequelize.TEXT
  }
})

Role.sync()

module.exports = Role
