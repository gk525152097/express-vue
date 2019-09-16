const debug = require('debug')('myAdminApp:personal')

const express = require('express')
const { promisify } = require('util')
const uuidv1 = require('uuid/v1')
const redis = require('../utils/redis')
const User = require('../model/user')

const TOKEN = 'Token'
const router = express.Router()

const hsetAsync = promisify(redis.client.hset).bind(redis.client)
const hdelAsync = promisify(redis.client.hdel).bind(redis.client)
const hgetAsync = promisify(redis.client.hget).bind(redis.client)

// function token() {
//   return uuidv1()
// }

router.post('/signIn', async (req, res, next) => {
  // 登录leanCloud - 获取用户 - 以token为键保存用户数据到redis - 返回token
  const { username, password } = req.body
  let user = await User.findOne({
    attributes: { exclude: ['password'] },
    where: { username, password }
  })


  if (user) {
    user = user.get({ plain: true })
    const token = uuidv1()
    hsetAsync(TOKEN, token, JSON.stringify(user))
      .then(() => {
        res.json({
          code: 20000,
          token,
          user
        })
      })
      .catch(next)
  } else {
    res.json({
      code: 40004,
      message: '登录失败'
    })
  }
})

// router.post('/signUp', (req, res, next) => {
//   // 注册leanCloud - 获取用户 - 以token为键保存用户数据到redis - 返回token
//   const { username } = req.body
//   const { password } = req.body
//   const user = new AV.User()
//   user.setUsername(username)
//   user.setPassword(password)
//   user.signUp()
//     .then(user => {
//       const token = user.getSessionToken()
//       redis.client.hmset(token, user.toJSON(), next)
//       res.json({
//         code: 20000,
//         token,
//         user: user.toJSON()
//       })
//     })
//     .catch(next)
// })

router.post('/signOut', (req, res, next) => {
  const token = req.header('x-token')
  hdelAsync(TOKEN, token)
    .then(() => {
      res.json({
        code: 20000,
        message: '已登出'
      })
    })


  // redis.client.del(token, number => {
  //   debug('number %d', number)
  //   res.json({
  //     code: 20000,
  //     message: '已登出'
  //   })
  // })
})

router.post('/userInfo', (req, res, next) => {
  const token = req.header('x-token')
  hgetAsync(TOKEN, token)
    .then(userStr => {
      // if (userStr !== 'nil') {}
      res.json({
        code: 20000,
        user: JSON.parse(userStr)
      })
      // return Promise.reject(new Error('404'))
    })
    .catch(next)
})

module.exports = router
