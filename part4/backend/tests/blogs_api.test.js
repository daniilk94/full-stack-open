const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const Blog = require('../models/blog')
const helper = require('./test_helper')
const blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('correct amount of blogs were returned as JSON', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('unique identifier is id not _id', async () => {
  const response = await api.get('/api/blogs')
  const blogObjectFields = Object.keys(response.body[0])
  assert(blogObjectFields.includes('id'))
  assert(!blogObjectFields.includes('_id'))
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
  }

  await api.post('/api/blogs').send(newBlog).expect(201)

  const blogListAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogListAtEnd.length, helper.initialBlogs.length + 1)

  const titles = blogListAtEnd.map((blog) => blog.title)
  assert(titles.includes('Type wars'))
})

test('default likes value is 0, if it is missed from the request body', async () => {
  const newBlog = {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html',
  }

  await api.post('/api/blogs').send(newBlog).expect(201)

  const blogListAtEnd = await helper.blogsInDb()
  const lastAddedBlog = blogListAtEnd[blogListAtEnd.length - 1]
  assert.strictEqual(lastAddedBlog.likes, 0)
})

test('if url or title missing, then response is Bad Request(400)', async () => {
  const newBlog_1 = {
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html',
    likes: 10,
  }
  const newBlog_2 = {
    title: 'First class tests',
    author: 'Robert C. Martin',
    likes: 10,
  }

  await api.post('/api/blogs').send(newBlog_1).expect(400)
  await api.post('/api/blogs').send(newBlog_2).expect(400)

  const blogListAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogListAtEnd.length, helper.initialBlogs.length)
})

after(async () => {
  await mongoose.connection.close()
})
