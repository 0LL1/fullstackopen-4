const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url:
      'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url:
      'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url:
      'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0
  }
]

test('there are six blogs', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body.length).toBe(6)
})

test('there is an id field', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body[0].id).toBeDefined()
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Test title',
    author: 'Olli',
    url: 'www.test.com',
    likes: 100
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const titles = response.body.map(r => r.title)

  expect(response.body.length).toBe(initialBlogs.length + 1)

  expect(titles).toContain('Test title')
})

test('likes default to 0', async () => {
  const newBlog = {
    title: 'Test title',
    author: 'Olli',
    url: 'www.test.com'
  }

  await api.post('/api/blogs').send(newBlog)

  const response = await api.get('/api/blogs')

  expect(response.body[response.body.length - 1].likes).toBe(0)
})

test('title and url are required', async () => {
  const newBlog = {
    author: 'Olli',
    likes: 100
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})

test('a blog can be deleted', async () => {
  const blogsAtStart = await api.get('/api/blogs')
  const blogToDelete = blogsAtStart.body[0]

  await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

  const blogsAtEnd = await api.get('/api/blogs')

  expect(blogsAtEnd.body.length).toBe(initialBlogs.length - 1)

  const titles = blogsAtEnd.body.map(r => r.title)

  expect(titles).not.toContain(blogToDelete.title)
})

test('a blog can be updated', async () => {
  const blogsAtStart = await api.get('/api/blogs')
  const blogToUpdate = blogsAtStart.body[0]

  const modifiedBlog = { ...blogToUpdate, likes: 123 }

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(modifiedBlog)
    .expect(200)

  const blogsAtEnd = await api.get('/api/blogs')

  expect(blogsAtEnd.body[0].likes).toBe(123)
})

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = initialBlogs.map(blog => new Blog(blog))

  const promiseArray = blogObjects.map(blog => blog.save())

  await Promise.all(promiseArray)
})

afterAll(() => {
  mongoose.connection.close()
})
