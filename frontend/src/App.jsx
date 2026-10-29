import { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import './App.css'
import useNotificationStore from './stores/notificationStore'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import persistentUser from './services/persistentUser'
import UsersView from './components/UsersView'
import BlogView from './components/BlogView'
import UserView from './components/UserView'
import CreateBlogView from './components/CreateBlogView'
import ErrorBoundary from './components/ErrorBoundary'
import useBlogStore from './stores/blogStore'
import useUserStore from './stores/userStore'



const sortBlogsByLikes = (blogs) => [...blogs].sort((a, b) => b.likes - a.likes)

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

const user = useUserStore((state) => state.user)

const setUser = useUserStore((state) => state.setUser)

const logoutUser = useUserStore(
  (state) => state.logoutUser,
)

useEffect(() => {
  const loggedUser = persistentUser.getUser()

  if (loggedUser) {
    setUser(loggedUser)
  }
}, [setUser])

  const navigate = useNavigate()

  // [5.4] show a banner for a few seconds
  const showNotification = useNotificationStore(
    (state) => state.showNotification,
  )

  const blogs = useBlogStore((state) => state.blogs)

  const initializeBlogs = useBlogStore((state) => state.initializeBlogs)

  const createBlogInStore = useBlogStore((state) => state.createBlog)

  const likeBlog = useBlogStore((state) => state.likeBlog)

const removeBlogFromStore = useBlogStore((state) => state.removeBlog,)

const addComment = useBlogStore((state) => state.addComment,)

  useEffect(() => {
    blogService.setToken(user?.token ?? null)
    initializeBlogs()
  }, [user, initializeBlogs])

  useEffect(() => {
    const id = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        const status = error?.response?.status
        const serverMsg = error?.response?.data?.error

        const looksLikeAuth =
          typeof serverMsg === 'string' &&
          serverMsg.toLowerCase().includes('token')
       if (status === 401 && looksLikeAuth) {
         persistentUser.removeUser()       
         blogService.setToken(null)
          logoutUser()
           initializeBlogs()
             showNotification('session expired, please log in again', 'error')
           }
        return Promise.reject(error)
      },
    )
    return () => axios.interceptors.response.eject(id)
  }, [showNotification, initializeBlogs, logoutUser ])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const loggedUser = await loginService.login({ username, password })
      persistentUser.saveUser(loggedUser),
    
      setUser(loggedUser)
      setUsername('')
      setPassword('')
      navigate('/')
    } catch {
      showNotification('wrong username or password', 'error')
    }
  }

  // [5.2] logout clears localStorage + state
  const handleLogout = () => {
    persistentUser.removeUser()
   blogService.setToken(null)
   logoutUser()
    setUsername('')
    setPassword('')
     navigate('/')
  }
const handleLike = async (blog) => {
  if (!user) {
    showNotification('you need to log in to like a blog', 'error')
    return
  }

  try {
    await likeBlog(blog)

    showNotification(
      `you liked '${blog.title}'`,
    )
  } catch (error) {
    const serverMsg = error?.response?.data?.error
    showNotification(serverMsg || 'failed to update blog', 'error')
  }
}

const handleComment = async (blog, comment) => {
  try {
    await addComment(blog.id, comment)

    showNotification('comment added')
  } catch (error) {
    const serverMsg = error?.response?.data?.error

    showNotification(
      serverMsg || 'failed to add comment',
      'error',
    )
  }
}

const removeBlog = async (blog) => {
  try {
    await removeBlogFromStore(blog)

    showNotification(
      `removed '${blog.title}' by ${blog.author}`,
    )

    navigate('/')
  } catch (error) {
    const serverMsg = error?.response?.data?.error
    showNotification(serverMsg || 'failed to delete blog', 'error')
  }
}

  const createBlog = async (newBlog) => {
    try {
      const createdBlog = await createBlogInStore(newBlog)

      showNotification(
        `a new blog '${createdBlog.title}' by ${createdBlog.author} added`,
      )

      navigate('/')

      return true
    } catch (error) {
      const serverMsg = error?.response?.data?.error
      showNotification(serverMsg || 'failed to create blog', 'error')
      return false
    }
  }

  const loginForm = () => {
    if (user) {
      return <p>{user.name} logged in</p>
    }

    return (
      <div className="login-container">
        <h2>Log in to application</h2>
        <Notification />{' '}
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="username">username</label>
            <input
              id="username"
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">password</label>
            <input
              id="password"
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
              className="form-input"
            />
          </div>
          <button type="submit" className="form-button">
            login
          </button>
        </form>
      </div>
    )
  }

  const blogList = () => (
    <div>
      <h2>blogs</h2>
      <Notification />
      {sortBlogsByLikes(blogs).map((blog) => (
        <div key={blog.id} className="blog">
          <Link to={`/blogs/${blog.id}`}>
            {blog.title} by {blog.author}
          </Link>
        </div>
      ))}
    </div>
  )

  return (
    <div>
      <nav className="app-nav">
        <div className="nav-brand">Blog App</div>

       <div className="nav-links">
  <Link to="/" className="nav-link">
    blogs
  </Link>

  <Link to="/users" className="nav-link">
    users
  </Link>

          {user ? (
            <>
              <Link to="/create" className="nav-link">
                create new
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="nav-link nav-button"
              >
                logout
              </button>
            </>
          ) : (
            <Link to="/login" className="nav-link">
              login
            </Link>
          )}
        </div>
      </nav>

      <ErrorBoundary>
        <Routes>
          <Route path="/" element={blogList()} />
          <Route path="/users" element={<UsersView />} />
          <Route path="/users/:id" element={<UserView />}/>
          <Route path="/login" element={loginForm()} />
          <Route
  path="/blogs/:id"
  element={
    <BlogView
      blogs={blogs}
      user={user}
      handleLike={handleLike}
      removeBlog={removeBlog}
      handleComment={handleComment}
    />
  }
/>
          <Route path="/create"element={<CreateBlogView user={user} createBlog={createBlog} />}  />
          <Route path="*" element={<h2>Page not found</h2>} />
        </Routes>
      </ErrorBoundary>
    </div>
  )
}

export default App
