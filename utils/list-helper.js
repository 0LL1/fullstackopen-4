const dummy = blogs => 1

const totalLikes = blogs => blogs.reduce((acc, blog) => acc + blog.likes, 0)

const favoriteBlog = blogs => {
  // not the cleanest solution but solution nonetheless
  const likes = blogs.map(blog => parseInt(blog.likes))

  const mostLikes = Math.max(...likes)

  return blogs.find(blog => blog.likes === mostLikes)
}

const mostBlogs = blogs => {
  // not super happy with this one but it gets the job done
  let blogCounts = []

  for (blog of blogs) {
    const blogsByAuthor = { author: blog.author, blogs: 0 }

    if (
      !blogCounts.find(blogCounts => blogCounts.author === blogsByAuthor.author)
    ) {
      blogCounts.push(blogsByAuthor)
    }

    for (blog of blogs) {
      if (blog.author === blogsByAuthor.author) {
        blogsByAuthor.blogs++
      }
    }
  }

  return blogCounts.reduce((max, cur) => (max > cur.blogs ? max : cur), 0)
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs }
