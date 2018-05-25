const Koa = require('koa')
const router = require('koa-router')()
const render = require('koa-art-template')
const path = require('path')
const bodyparser = require('koa-bodyparser')

const DB = require('./module/db.js')

const app = new Koa()

app.use(bodyparser())

render(app, {
  root: path.join(__dirname, 'views'),
  extname: '.html',
  debug: process.env.NODE_ENV !== 'production'
})

router.get('/', async (ctx) => {
  let result  = await DB.find('user', {})
  await ctx.render('index', {
    list: result
  })
})

router.get('/add', async ctx => {
  await ctx.render('add')
})

router.post('/doAdd', async ctx => {
  let result = await DB.insert('user', ctx.request.body)
  try {
    if(result.result.ok) {
      ctx.redirect('/')
    }
  } catch (error) {
    console.log(err)
    ctx.redirect('/add')
    return
  }
})

router.get('/edit', async ctx => {
  let id = ctx.query.id
  let data = await DB.find('user', {
    _id: DB.getObjectId(id)
  })
  await ctx.render('edit', {
    list: data[0]
  })
})

router.post('/doEdit', async ctx => {
  let req = ctx.request.body
  let result = await DB.update('user', {
    _id: DB.getObjectId(req.id)
  }, {
    userName: req.userName,
    age: req.age,
    sex: req.sex
  })
  try {
    if(result.result.ok) {
      ctx.redirect('/')
    }
  } catch (error) {
    console.log(err)
    ctx.redirect('/add')
    return
  }
})

router.get('/delete', async ctx => {
  let id = ctx.query.id
  let res = await DB.remove('user', {
    _id: DB.getObjectId(id)
  })
  try {
    if(res.result.ok) {
      ctx.redirect('/')
    }
  } catch (error) {
    console.log(err)
    ctx.redirect('/')
    return
  }
})

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(3000, '127.0.0.1')