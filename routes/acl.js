const express = require('express')
const { promisify } = require('util')
const AV = require('../utils/leancloud')
const redis = require('../utils/redis')
const Acl = require('../model/acl')

const ACL = 'Acl'
const router = express.Router()

const hsetAsync = promisify(redis.client.hset).bind(redis.client)
const hdelAsync = promisify(redis.client.hdel).bind(redis.client)
const hscanAsync = promisify(redis.client.hscan).bind(redis.client)

router.post('/create', (req, res, next) => {
  const { path, roles } = req.body
  Promise
    .all([
      Acl.create({ path, roles }),
      hsetAsync(ACL, path, roles.join())
    ])
    .then(values => {
      res.json({
        code: 20000,
        acl: values[0].get({ plain: true })
      })
    })
    .catch(next)
})

router.post('/delete', (req, res, next) => {
  const { path } = req.body
  Promise
    .all([
      Acl.destroy({ where: { path } }),
      hdelAsync(ACL, path)
    ])
    .then(values => {
      res.json({
        code: 20000,
        affectedCount: values[0]
      })
    })
    .catch(next)
})

router.post('/update', (req, res, next) => {
  const { path, roles } = req.body
  Promise
    .all([
      Acl.update({ roles }, { where: { path } }),
      hsetAsync(ACL, path, roles.join())
    ])
    .then(values => {
      res.json({
        code: 20000,
        affectedCount: values[0][0]
      })
    })
    .catch(next)
})

router.post('/query', (req, res, next) => {
  const { path = '' } = req.body
  hscanAsync(ACL, 0, 'match', `*${path}*`)
    .then(result => {
      const r = {}
      for (let i = 0; i <= result[1].length; i += 2) {
        r[result[1][i]] = result[1][i + 1]
      }
      res.json({
        code: 20000,
        acls: r
      })
    })
    .catch(next)
})

module.exports = router
