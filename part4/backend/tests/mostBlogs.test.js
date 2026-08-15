const { test, describe } = require('node:test')
const assert = require('node:assert')

const { emptyList, listOfOne, listOfMany } = require('./blogList')
const mostBlogs = require('../utils/list_helper').mostBlogs

describe('Most blogs', () => {
  test('of empty list is noone', () => {
    assert.deepStrictEqual(mostBlogs(emptyList), null)
  })

  test('when list has only one blog then its author has most blogs', () => {
    assert.deepStrictEqual(mostBlogs(listOfOne), {
      author: 'Michael Chan',
      blogs: 1,
    })
  })

  test('of a bigger list is calculated right', () => {
    assert.deepStrictEqual(mostBlogs(listOfMany), {
      author: 'Robert C. Martin',
      blogs: 3,
    })
  })
})
