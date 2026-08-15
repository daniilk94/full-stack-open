const { test, describe } = require('node:test')
const assert = require('node:assert')

const { emptyList, listOfOne, listOfMany } = require('./blogList')
const mostLikes = require('../utils/list_helper').mostLikes

describe('Most likes', () => {
  test('of empty list is noone', () => {
    assert.deepStrictEqual(mostLikes(emptyList), null)
  })

  test('when list has only one blog then its author has most likes', () => {
    assert.deepStrictEqual(mostLikes(listOfOne), {
      author: 'Michael Chan',
      likes: 7,
    })
  })

  test('of a bigger list is calculated right', () => {
    assert.deepStrictEqual(mostLikes(listOfMany), {
      author: 'Edsger W. Dijkstra',
      likes: 17,
    })
  })
})
