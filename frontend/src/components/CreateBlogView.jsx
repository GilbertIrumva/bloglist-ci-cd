import Notification from './Notification'
import BlogForm from './BlogForm'

const CreateBlogView = ({ user, createBlog }) => {
  return (
    <div>
      <h2>Create new blog</h2>

      <Notification />

      {!user && <p>Please log in to create a new blog.</p>}

      <BlogForm createBlog={createBlog} />
    </div>
  )
}

export default CreateBlogView