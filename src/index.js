import { GraphQLServer } from 'graphql-yoga'

const users = [
  {
    id: '1',
    age: 31,
    name: 'Jens',
    email: 'test@test.com',
  },
  {
    id: '2',
    name: 'Sarah',
    email: 'Sarah@test.com',
  },
  {
    id: '3',
    name: 'Mike',
    email: 'Mike@test.com',
  },
]

const posts = [
  {
    id: '092',
    title: 'GraphQL basics!',
    body: '',
    published: false,
    author: '1',
  },
  {
    id: '456',
    title: 'Post 2!',
    body: 'Test test test',
    published: true,
    author: '1',
  },
  {
    id: '788',
    title: 'Post 3!',
    body: 'This is a super awesome post!',
    published: false,
    author: '2',
  },
]

const comments = [
  {
    id: 'aiogr',
    text: 'This is comment 1!',
    author: '3',
    post: '092',
  },
  {
    id: 'agga',
    text: 'This is comment 2!',
    author: '3',
    post: '456',
  },
  {
    id: 'rqr',
    text: 'This is comment 3!',
    author: '1',
    post: '456',
  },
  {
    id: 'ghrh',
    text: 'This is comment 4!',
    author: '2',
    post: '788',
  },
]

// Type definitions (schema)
const typeDefs = `
    type Query {
        comments: [Comment!]!
        posts(query: String): [Post!]!
        users(query: String): [User!]!
        me: User!
        post: Post!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment]
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments: [Comment]
    }

    type Comment {
        id: ID!
        text: String!
        author: User!
        post: Post!
    }
`

const postContains = (item, query) => {
  return item.toLowerCase().includes(query.toLowerCase())
}

// Resolvers
const resolvers = {
  Query: {
    me() {
      return {
        id: '123',
        name: 'Jens',
        email: 'Test@test.com',
        age: 31,
      }
    },
    post() {
      return {
        id: '092',
        title: 'GraphQL basics!',
        body: '',
        published: false,
      }
    },
    posts(parent, args, ctx, info) {
      if (!args.query) {
        return posts
      }
      return posts.filter(
        (post) =>
          postContains(post.body, args.query) ||
          postContains(post.title, args.query)
      )
    },
    users(parent, args, ctx, info) {
      if (!args.query) {
        return users
      }
      return users.filter((user) =>
        user.name.toLowerCase().includes(args.query.toLowerCase())
      )
    },
    comments(parent, args, ctx, info) {
      return comments
    },
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find((user) => parent.author === user.id)
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => comment.post === parent.id)
    },
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter((post) => post.author === parent.id)
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => comment.author === parent.id)
    },
  },
  Comment: {
    author({ author }, args, ctx, info) {
      return users.find(({ id }) => id === author)
    },
    post(parent, args, ctx, info) {
      return posts.find(({ id }) => id === parent.post)
    },
  },
}

const server = new GraphQLServer({
  typeDefs,
  resolvers,
})

server.start(() => {
  console.log('The server is up!')
})
