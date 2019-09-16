const express = require('express')
const Sequelize = require('sequelize')

const { Op } = Sequelize

const router = express.Router()

const AV = require('../utils/leancloud')

const ROLE = '_Role'
// const { Role } = AV
const Role = require('../model/role')


router.post('/create', (req, res, next) => {
  const { name, description } = req.body
  Role
    .create({ name, description })
    .then(role => {
      res.json({
        code: 20000,
        role: role.get({ plain: true })
      })
    })
    .catch(next)
})

router.post('/delete', (req, res, next) => {
  const { uuid } = req.body
  Role
    .destroy({ where: { uuid } })
    .then(affectedCount => {
      res.json({
        code: 20000,
        affectedCount
      })
    })
    .catch(next)
})

router.post('/update', (req, res, next) => {
  const { uuid, name, description } = req.body
  Role
    .update({ name, description }, { where: { uuid } })
    .then(values => {
      res.json({
        code: 20000,
        affectedCount: values[0]
      })
    })
    .catch(next)
})

router.post('/query', (req, res, next) => {
  const { name = '' } = req.body
  Role
    .findAll({ where: { name: { [Op.like]: `%${name}%` } } })
    .then(roles => {
      res.json({
        code: 20000,
        roles: roles.map(role => role.get({ plain: true }))
      })
    })
    .catch(next)
})

module.exports = router
