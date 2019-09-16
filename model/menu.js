const Sequelize = require('sequelize')
const sequelize = require('../utils/sequelize')

const Menu = sequelize.define('menu', {
  uuid: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    unique: true
  },
  path: {
    type: Sequelize.STRING,
    unique: true
  },
  component: {
    type: Sequelize.STRING
  },
  redirect: {
    type: Sequelize.STRING
  },
  hidden: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  alwaysShow: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  title: {
    type: Sequelize.STRING
  },
  icon: {
    type: Sequelize.STRING
  },
  roles: {
    type: Sequelize.JSON
  },
  affix: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  noCache: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  breadcrumb: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  getterMethods: {
    meta() {
      return {
        title: this.title,
        icon: this.icon,
        roles: this.roles,
        affix: this.affix,
        noCache: this.noCache,
        breadcrumb: this.breadcrumb
      }
    }
  },
  setterMethods: {
    meta(value) {
      const {
        title, icon, roles, affix, noCache, breadcrumb
      } = value
      this.setDataValue('title', title)
      this.setDataValue('icon', icon)
      this.setDataValue('roles', roles)
      this.setDataValue('affix', affix)
      this.setDataValue('noCache', noCache)
      this.setDataValue('breadcrumb', breadcrumb)
    }
  }
})

Menu.sync()

module.exports = Menu
