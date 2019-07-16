const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response, next) => {
  const users = await User.find({}).populate('blogs', {
    title: 1,
    author: 1,
    url: 1
  })

  response.json(users.map(user => user.toJSON()))
})

usersRouter.post('/', async (request, response, next) => {
  try {
    const body = request.body

    if (body.password === undefined) {
      return response.status(400).json({ error: 'password is missing' })
    } else if (body.password.length < 3) {
      return response
        .status(400)
        .json({ error: 'password must be at least 3 characters long' })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash
    })

    const savedUser = await user.save()

    response.json(savedUser)
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'MongoError') {
      return response.status(400).json({ error: error.message })
    }
    next(error)
  }
})

module.exports = usersRouter
