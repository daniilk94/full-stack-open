const { test, describe } = require('node:test')
const assert = require('node:assert')

const { emptyList, listOfOne, listOfMany } = require('./blogList')
const totalLikes = require('../utils/list_helper').totalLikes

describe('Total likes', () => {
  test('of empty list is zero', () => {
    assert.strictEqual(totalLikes(emptyList), 0)
  })

  test('when list has only one blog equals the likes of that', () => {
    assert.strictEqual(totalLikes(listOfOne), 7)
  })

  test('of a bigger list is calculated right', () => {
    assert.strictEqual(totalLikes(listOfMany), 36)
  })
})
