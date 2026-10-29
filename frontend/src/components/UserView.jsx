import { useParams } from 'react-router-dom'
import useUserListStore from '../stores/userListStore'

const UserView = () => {
  const { id } = useParams()

  const users = useUserListStore(
    (state) => state.users,
  )

  const user = users.find(
    (u) => u.id === id,
  )

  if (!user) {
    return <div>user not found</div>
  }

  return (
    <div>
      <h2>{user.name}</h2>

      <h3>Added blogs</h3>

      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>
            {blog.title}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default UserView