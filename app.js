const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const { promisify } = require('util')
const redis = require('./utils/redis')

const TOKEN = 'Token'
const hgetallAsync = promisify(redis.client.hgetall).bind(redis.client)
const hexistsAsync = promisify(redis.client.hexists).bind(redis.client)
const hgetAsync = promisify(redis.client.hget).bind(redis.client)

// const sequelize = require('./utils/sequelize');

const app = express()

// 跨域中间件
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin)
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type,X-Token')
  res.header('Access-Control-Allow-Credentials', 'true')
  next()
})
// HTTP request logger middleware for node.js
app.use(logger('dev'))
// express 官方中间件
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))
// 用于cookie操作，暂时未使用，未来解决跨域问题后可能会用cookie保存token，所以先保留
// 跨域问题可能解决方法参考：https://www.jianshu.com/p/aa6cc22c8d23
app.use(cookieParser())

app.use(async (req, res, next) => {
  let isPass = false
  /* 路由权限判断 */
  const { method } = req
  const { path } = req
  const token = req.header('x-token')

  // console.log('cookies', req.cookies)

  if (!token || method === 'OPTIONS') {
    isPass = true
  } else {
    const userStr = await hgetAsync(TOKEN, token)
    const user = JSON.parse(userStr)
    if (user.roles.includes('admin')) {
      isPass = true
    } else {
      const aclDirt = await hgetallAsync('Acl')
      if (Object.keys(aclDirt).includes(path)) {
        isPass = aclDirt[path].split(',').some(role => user.roles.includes(role))
      } else {
        isPass = true
      }
    }
  }
  if (isPass) {
    next()
  } else {
    res.status(500)
    res.json({
      message: '未通过路由判断'
    })
  }
})

app.use(async (req, res, next) => {
  let isPass = false
  /* 登录状态判断 */
  const { method } = req
  const whiteList = ['/personal/signIn', '/personal/signUp']
  if (whiteList.includes(req.path) || method === 'OPTIONS') {
    isPass = true
  } else {
    const token = req.header('x-token')
    if (await hexistsAsync(TOKEN, token)) {
      isPass = true
    }
  }
  if (isPass) {
    next()
  } else {
    res.status(500)
    res.json({
      message: '未通过登录状态判断'
    })
  }
})

app.use('/', require('./routes/index'))
app.use('/personal', require('./routes/personal'))
app.use('/role', require('./routes/role'))
app.use('/user', require('./routes/user'))
app.use('/menu', require('./routes/menu'))
app.use('/acl', require('./routes/acl'))
app.use('/example/upload', require('./routes/example/upload'))

// error handlers
app.use((err, req, res, next) => {
  if (req.timedout && req.headers.upgrade === 'websocket') {
    // 忽略 websocket 的超时
    return
  }

  const statusCode = err.status || 500
  if (statusCode === 500) {
    console.error(err.stack || err)
  }
  if (req.timedout) {
    console.error('请求超时: url=%s, timeout=%d, 请确认方法执行耗时很长，或没有正确的 response 回调。', req.originalUrl, err.timeout)
  }
  res.status(statusCode)
  // 默认不输出异常详情
  // let error = {};
  if (app.get('env') === 'development') {
    // 如果是开发环境，则将异常堆栈输出到页面，方便开发调试
    // error = err;
  }
  res.json({
    message: err.message
  })
})

module.exports = app
