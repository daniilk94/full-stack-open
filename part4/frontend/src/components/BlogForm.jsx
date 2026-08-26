import { useState } from 'react'

const BlogForm = ({ onCreateBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()

    onCreateBlog({
      title: title,
      author: author,
      url: url,
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }
  return (
    <div>
      <div>
        <h2>Create new Blog</h2>
        <form onSubmit={addBlog}>
          <div>
            <label>
              Title:
              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              Author:
              <input
                type="text"
                value={author}
                onChange={(event) => setAuthor(event.target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              URL:
              <input
                type="text"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
              />
            </label>
          </div>
          <button type="submit">Create</button>
        </form>
      </div>
    </div>
  )
}

export default BlogForm
