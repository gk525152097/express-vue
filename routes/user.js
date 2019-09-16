const express = require('express')

const { Op } = require('sequelize')

const router = express.Router()

const AV = require('../utils/leancloud')

const USER = '_User'
// const { User } = AV
const User = require('../model/user')

router.post('/create', (req, res, next) => {
  const {
    username, password, email, mobilePhoneNumber, roles
  } = req.body
  User
    .create({
      username, password, email, mobilePhoneNumber, roles
    })
    .then(user => {
      res.json({
        code: 20000,
        user: user.get({ plain: true })
      })
    })
    .catch(next)
})

router.post('/delete', (req, res, next) => {
  const { uuid } = req.body
  User
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
  const {
    uuid, username, email, mobilePhoneNumber, roles
  } = req.body
  User
    .update({
      username, email, mobilePhoneNumber, roles
    }, { where: { uuid } })
    .then(values => {
      res.json({
        code: 20000,
        affectedCount: values[0]
      })
    })
    .catch(next)
})

router.post('/query', (req, res, next) => {
  const { username = '' } = req.body
  User
    .findAll({
      attributes: { exclude: ['password'] },
      where: { username: { [Op.like]: `%${username}%` } }
    })
    .then(users => {
      res.json({
        code: 20000,
        users: users.map(user => user.get({ plain: true }))
      })
    })
    .catch(next)
})

module.exports = router
