const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  if (blogs.length === 0) {
    return 0
  } else if (blogs.length === 1) {
    return blogs[0].likes
  } else {
    return blogs.reduce(
      (likesSum, currentBlog) => likesSum + currentBlog.likes,
      0,
    )
  }
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  } else if (blogs.length === 1) {
    return blogs[0]
  } else {
    return blogs.reduce((mostLikedBlog, currentBlog) =>
      currentBlog.likes > mostLikedBlog.likes ? currentBlog : mostLikedBlog,
    )
  }
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  } else {
    const authors = new Map()
    blogs.forEach((blog) => {
      if (authors.has(blog.author)) {
        authors.set(blog.author, authors.get(blog.author) + 1)
      } else {
        authors.set(blog.author, 1)
      }
    })

    const mostRecords = [...authors.entries()].reduce(
      (mostRecords, currentAuthor) =>
        currentAuthor[1] > mostRecords[1] ? currentAuthor : mostRecords,
    )

    return { author: mostRecords[0], blogs: mostRecords[1] }
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  } else {
    const authors = new Map()
    blogs.forEach((blog) => {
      if (authors.has(blog.author)) {
        authors.set(blog.author, authors.get(blog.author) + blog.likes)
      } else {
        authors.set(blog.author, blog.likes)
      }
    })

    const mostLikes = [...authors.entries()].reduce(
      (mostLikes, currentAuthor) =>
        currentAuthor[1] > mostLikes[1] ? currentAuthor : mostLikes,
    )

    return { author: mostLikes[0], likes: mostLikes[1] }
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
