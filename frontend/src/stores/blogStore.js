import { create } from 'zustand'
import blogService from '../services/blogs'

const sortBlogsByLikes = (blogs) =>
  [...blogs].sort((a, b) => b.likes - a.likes)

const useBlogStore = create((set) => ({
  blogs: [],

  initializeBlogs: async () => {
    const blogs = await blogService.getAll()

    set({
      blogs: sortBlogsByLikes(blogs),
    })
  },

  createBlog: async (newBlog) => {
    const createdBlog = await blogService.create(newBlog)

    set((state) => ({
      blogs: sortBlogsByLikes([
        ...state.blogs,
        createdBlog,
      ]),
    }))

    return createdBlog
  },

  likeBlog: async (blog) => {
    const userId =
      blog.user && typeof blog.user === 'object'
        ? blog.user.id
        : blog.user

    const updatedBlog = await blogService.update(blog.id, {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: userId,
    })

    set((state) => ({
      blogs: sortBlogsByLikes(
        state.blogs.map((b) =>
          b.id === blog.id ? updatedBlog : b
        ),
      ),
    }))

    return updatedBlog
  },

  removeBlog: async (blog) => {
    await blogService.remove(blog.id)

    set((state) => ({
      blogs: state.blogs.filter(
        (b) => b.id !== blog.id,
      ),
    }))
  },
   addComment: async (id, comment) => {
  const updatedBlog = await blogService.addComment(
    id,
    comment,
  )

  set((state) => ({
    blogs: state.blogs.map((blog) =>
      blog.id === id ? updatedBlog : blog,
    ),
  }))

  return updatedBlog
},
  
}))

export default useBlogStore