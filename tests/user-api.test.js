const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

const initialUsers = [
  {
    _id: '5d278ce0daecf817b36e9fa4',
    username: 'Test1',
    name: 'Olli',
    __v: 0
  },
  {
    _id: '5d278f50a19d43188e83bf98',
    username: 'Test2',
    name: 'Paavo',
    __v: 0
  },
  {
    _id: '5d278f7aa19d43188e83bf99',
    username: 'Test3',
    name: 'Emmi',
    __v: 0
  },
  {
    _id: '5d278f94a19d43188e83bf9a',
    username: 'Test4',
    name: 'Pekka',
    __v: 0
  }
]

test('a valid user can be added', async () => {
  const usersAtStart = await api.get('/api/users')

  const newUser = {
    username: 'uniquename',
    name: 'Test Name',
    password: 'validPW'
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const usersAtEnd = await api.get('/api/users')

  expect(usersAtEnd.body.length).toBe(usersAtStart.body.length + 1)

  const usernames = usersAtEnd.body.map(user => user.username)

  expect(usernames).toContain(newUser.username)
})

test('username is required', async () => {
  const usersAtStart = await api.get('/api/users')

  const newUser = {
    name: 'Test Name',
    password: 'validPW'
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  expect(result.body.error).toContain('User validation failed')

  const usersAtEnd = await api.get('/api/users')

  expect(usersAtEnd.body.length).toBe(usersAtStart.body.length)
})

test('password is required', async () => {
  const usersAtStart = await api.get('/api/users')

  const newUser = {
    username: 'Valid',
    name: 'Test Name'
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  expect(result.body.error).toContain('password is missing')

  const usersAtEnd = await api.get('/api/users')

  expect(usersAtEnd.body.length).toBe(usersAtStart.body.length)
})

test('username must be unique', async () => {
  const usersAtStart = await api.get('/api/users')

  const newUser = {
    username: 'Test1',
    name: 'Test Name',
    password: 'validPW'
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  expect(result.body.error).toContain('`username` to be unique')

  const usersAtEnd = await api.get('/api/users')

  expect(usersAtEnd.body.length).toBe(usersAtStart.body.length)
})

test('username must be at least 3 characters long', async () => {
  const usersAtStart = await api.get('/api/users')

  const newUser = {
    username: 'un',
    name: 'Test Name',
    password: 'validPW'
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  expect(result.body.error).toContain('User validation failed')

  const usersAtEnd = await api.get('/api/users')

  expect(usersAtEnd.body.length).toBe(usersAtStart.body.length)
})

test('password must be at least 3 characters long', async () => {
  const usersAtStart = await api.get('/api/users')

  const newUser = {
    username: 'Valid',
    name: 'Test Name',
    password: 'pw'
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  expect(result.body.error).toContain(
    'password must be at least 3 characters long'
  )

  const usersAtEnd = await api.get('/api/users')

  expect(usersAtEnd.body.length).toBe(usersAtStart.body.length)
})

beforeEach(async () => {
  await User.deleteMany({})

  const userObjects = initialUsers.map(user => new User(user))

  const promiseArray = userObjects.map(user => user.save())

  await Promise.all(promiseArray)
})

afterAll(() => {
  mongoose.connection.close()
})
