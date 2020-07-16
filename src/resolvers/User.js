const User = {
  credit(parent, args, { db }, info) {
    const date = new Date()
    let credit = parent.credit
    switch (parent.calc) {
      case 'INCL':
        credit = credit * 1.21
        break
      case 'TAX':
        credit = credit * 0.21
        break
      default:
        break
    }
    return credit
  },
  posts(parent, args, { db }, info) {
    return db.posts.filter((post) => {
      return post.author === parent.id
    })
  },
  comments(parent, args, { db }, info) {
    return db.comments.filter((comment) => {
      return comment.author === parent.id
    })
  },
}

export { User as default }
