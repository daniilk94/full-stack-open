const { test, describe } = require('node:test')
const assert = require('node:assert')

const { emptyList, listOfOne, listOfMany } = require('./blogList')
const favoriteBlog = require('../utils/list_helper').favoriteBlog

describe('Favourite blog', () => {
  test('of empty list is nothing', () => {
    assert.deepStrictEqual(favoriteBlog(emptyList), null)
  })

  test('(when list has only one blog) is itself', () => {
    assert.deepStrictEqual(favoriteBlog(listOfOne), listOfOne[0])
  })

  test('of a bigger list is the one (or the first) with the most likes', () => {
    assert.deepStrictEqual(favoriteBlog(listOfMany), listOfMany[2])
  })
})
