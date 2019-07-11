const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})

  response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.post('/', async (request, response) => {
  try {
    const blog = new Blog(request.body)

    const savedBlog = await blog.save()

    response.status(201).json(savedBlog.toJSON())
  } catch (error) {
    response.status(400).end()
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    await Blog.findByIdAndRemove(request.params.id)

    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  try {
    const blog = {
      title: request.body.title,
      author: request.body.author,
      url: request.body.url,
      likes: request.body.likes
    }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
      new: true
    })

    response.json(updatedBlog.toJSON())
  } catch (error) {
    next(error)
  }
})

module.exports = blogsRouter
