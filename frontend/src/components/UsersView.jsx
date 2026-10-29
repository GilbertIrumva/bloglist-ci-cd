import { useEffect } from 'react'
import useUserListStore from '../stores/userListStore'
import { Link } from 'react-router-dom'

const UsersView = () => {
  const users = useUserListStore((state) => state.users)
  const initializeUsers = useUserListStore(
    (state) => state.initializeUsers,
  )

  useEffect(() => {
    initializeUsers()
  }, [initializeUsers])

   return (
  <div className="users-view">
    <h2>Users</h2>

    <table className="users-table">
      <tbody>
        <tr>
          <th>User</th>
          <th>Blogs created</th>
        </tr>

       {users.map((user) => (
  <tr key={user.id}>
    <td>
      <Link to={`/users/${user.id}`}>
        {user.name}
      </Link>
    </td>
    <td>{user.blogs.length}</td>
  </tr>
))}
      </tbody>
    </table>
  </div>
)
  
}

export default UsersView