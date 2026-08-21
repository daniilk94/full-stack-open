const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const Blog = require('../models/blog')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const api = supertest(app)

describe('When there is initially some blogs saved to database', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  describe('blogs can be fetched as json with with correct format of id', () => {
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
  })

  describe('addition of a new blog', () => {
    test('succeeds with valid data', async () => {
      const newBlog = {
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 2,
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogListAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogListAtEnd.length, helper.initialBlogs.length + 1)

      const titles = blogListAtEnd.map((blog) => blog.title)
      assert(titles.includes('Type wars'))
    })

    test('succeeds with default likes value 0, if they were not provided', async () => {
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

    test('fails with status code 400 if url or title missing', async () => {
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
  })

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogListAtStart = await helper.blogsInDb()
      const blogToDelete = blogListAtStart[0]

      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

      const blogsListAtEnd = await helper.blogsInDb()

      const ids = blogsListAtEnd.map((blog) => blog.id)
      assert(!ids.includes(blogToDelete.id))

      assert.strictEqual(blogsListAtEnd.length, helper.initialBlogs.length - 1)
    })
    test('fails with statuscode 400 id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445'
      await api.delete(`/api/blogs/${invalidId}`).expect(400)
    })
  })

  describe('update of a blog', () => {
    test('succeeds with status code 200 if id and data are valid', async () => {
      const blogListAtStart = await helper.blogsInDb()
      const blogToUpdateAtStart = blogListAtStart[0]

      const newData = {
        title: 'Chelsea is the best football club',
        author: 'Frank Lampard',
        url: 'www.chelsea.com',
        likes: 8,
      }

      const updatedBlog = await api
        .put(`/api/blogs/${blogToUpdateAtStart.id}`)
        .send(newData)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const blogListAtEnd = await helper.blogsInDb()
      const blogToUpdateAtEnd = blogListAtEnd.find(
        (blog) => blog.id === blogToUpdateAtStart.id,
      )
      assert.deepStrictEqual(updatedBlog.body, blogToUpdateAtEnd)
      assert.strictEqual(blogListAtEnd.length, helper.initialBlogs.length)
    })

    test('succeeds with status code 200 even if only part of data upodated', async () => {
      const blogListAtStart = await helper.blogsInDb()
      const blogToUpdateAtStart = blogListAtStart[0]

      const newData = {
        likes: 8,
      }

      const updatedBlog = await api
        .put(`/api/blogs/${blogToUpdateAtStart.id}`)
        .send(newData)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const blogListAtEnd = await helper.blogsInDb()
      const blogToUpdateAtEnd = blogListAtEnd.find(
        (blog) => blog.id === blogToUpdateAtStart.id,
      )
      assert.deepStrictEqual(updatedBlog.body, blogToUpdateAtEnd)
      assert.strictEqual(blogListAtEnd.length, helper.initialBlogs.length)
    })

    test('fails with statuscode 400 id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445'
      await api.put(`/api/blogs/${invalidId}`).expect(400)
    })
    test('falls with statuscode 404 if blog does not exist', async () => {
      const validNonexistingId = await helper.nonExistingId()
      await api.put(`/api/blogs/${validNonexistingId}`).expect(404)
    })
  })
})

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('password', 10)
    const user = new User({ username: 'test', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'newuser',
      name: 'New User',
      password: 'strongPassword',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map((user) => user.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails with proper statuscode and message if username is taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'test',
      name: 'Second test',
      password: 'secret',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()

    assert(result.body.error.includes('expected `username` to be unique'))
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})
