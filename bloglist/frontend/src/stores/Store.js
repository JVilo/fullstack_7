import blogService from '../services/blogs'


const useBlogStore = create((set, get) => ({
  blogs: [],
  actions: {
    initialize: async () => {
      const blogs = await blogService.getAll()
      set({ blogs })
    },
    add: async (blogObject) => {
      const newBlog = await blogService.create(blogObject)
      set((state) => ({ blogs: state.blogs.concat(newBlog) }))
    },
    remove: async (id) => {
      await blogService.remove(id)
      set((state) => ({
        blogs: state.blogs.filter((b) => b.id !== id),
      }))
    },
    likeOf: async (id) => {
      const blogToLike = get().blogs.find((b) => b.id === id)
      if (!blogToLike) return

      const updatedBlog = {
        ...blogToLike,
        likes: (blogToLike.likes || 0) + 1,
        user: blogToLike.user?.id || blogToLike.user,
      }

      const returnedBlog = await blogService.update(id, updatedBlog)

      set((state) => ({
        blogs: state.blogs.map((b) => (b.id !== id ? b : returnedBlog)),
      }))
    },
  },
}))

export const useBlogs = () => useBlogStore((state) => state.blogs)
export const useLikeOf = () => useBlogStore((state) => state.actions.likeOf)
export const useBlogActions = () => useBlogStore((state) => state.actions)