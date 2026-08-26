const BlogCreationForm = (props) => {
  return (
    <div>
      <h2>Create new Blog</h2>
      <form onSubmit={props.addBlog}>
        <div>
          <label>
            Title:
            <input
              type="text"
              value={props.title}
              onChange={props.handleTitleChange}
            />
          </label>
        </div>
        <div>
          <label>
            Author:
            <input
              type="text"
              value={props.author}
              onChange={props.handleAuthorChange}
            />
          </label>
        </div>
        <div>
          <label>
            URL:
            <input
              type="text"
              value={props.url}
              onChange={props.handleUrlChange}
            />
          </label>
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  )
}

export default BlogCreationForm
