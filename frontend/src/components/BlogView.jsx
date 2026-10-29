import { useState } from 'react'
import { useParams } from 'react-router-dom'
import Notification from './Notification'

const BlogView = ({ blogs, user, handleLike, removeBlog, handleComment }) => {
  const { id } = useParams()
  const blog = blogs.find((b) => b.id === id)
 

  const [comment, setComment] = useState('')

  const submitComment = async (event) => {
    event.preventDefault()

    await handleComment(blog, comment)

    setComment('')
  }

  if (!blog) {
    return <div>blog not found</div>
  }

  const currentUsername = user?.username

  const isCreator =
    blog.user &&
    typeof blog.user === 'object' &&
    blog.user.username === currentUsername

  return (
    <article className="single-blog">
      <div className="single-blog-header">
        <div>
          <h2 className="single-blog-title">{blog.title}</h2>
          <p className="single-blog-author">by {blog.author}</p>
        </div>

        {blog.user && (
          <p className="single-blog-owner">added by {blog.user.name}</p>
        )}
      </div>

      <Notification />

      <div className="single-blog-url">
        <span className="single-blog-url-label">URL:</span>
        <a
          href={blog.url}
          target="_blank"
          rel="noreferrer"
          className="single-blog-url-link"
        >
          visit site
        </a>
      </div>

      <div className="single-blog-actions">
        <span className="blog-like-count">likes {blog.likes}</span>

        {user && (
          <button
            type="button"
            onClick={() => handleLike(blog)}
            className="blog-button blog-button--like"
          >
            like
          </button>
        )}

        {isCreator && (
          <button
            type="button"
            onClick={() => removeBlog(blog)}
            className="blog-button blog-button--remove"
          >
            remove
          </button>
        )}
      </div>

      <div className="comments-section">
        <h3>Comments</h3>

        <form onSubmit={submitComment} className="comment-form">
          <input
            value={comment}
            onChange={({ target }) => setComment(target.value)}
            placeholder="Write a comment..."
            className="comment-input"
          />

          <button type="submit" className="blog-button blog-button--comment">
            add comment
          </button>
        </form>

        {blog.comments && blog.comments.length > 0 ? (
          <ul className="comments-list">
            {blog.comments.map((comment, index) => (
              <li key={index}>{comment}</li>
            ))}
          </ul>
        ) : (
          <p className="no-comments">No comments yet</p>
        )}
      </div>
    </article>
  )
}

export default BlogView
