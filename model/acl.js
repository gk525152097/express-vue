const Sequelize = require('sequelize')
const sequelize = require('../utils/sequelize')

const Acl = sequelize.define('acl', {
  uuid: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  path: {
    type: Sequelize.STRING,
    unique: true
  },
  roles: {
    type: Sequelize.JSON
  }
})

Acl.sync()

module.exports = Acl
