const express = require('express')
const { promisify } = require('util')
const redis = require('../utils/redis')

const MENU = 'Menu'
const router = express.Router()
const setAsync = promisify(redis.client.set).bind(redis.client)
const getAsync = promisify(redis.client.get).bind(redis.client)

router.post('/update', (req, res, next) => {
  const { menu } = req.body
  setAsync(MENU, JSON.stringify(menu))
    .then(() => {
      res.json({
        code: 20000
      })
    })
    .catch(next)
})

router.post('/query', (req, res, next) => {
  getAsync(MENU)
    .then(menuStr => {
      res.json({
        code: 20000,
        menu: JSON.parse(menuStr)
      })
    })
    .catch(next)
})

module.exports = router
