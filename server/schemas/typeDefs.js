const {gql} = require ('apollo-server-express');

const typeDefs= gql`
type Book{
bookId: String
authors: [String]
description: String
title: String
image: String
link: String
}

type User {
_id: ID
username: String
email: String
bookCount: Int
savedBooks:[Book]
}

type Auth {
token: String
user:User
}

type Query{
me:User}

input SaveBookInput {
bookId: String
authors: [String]
description: String
title: String
image: String
link:String
}

type Mutations {
login (email: String!, password: String!): Auth
addUser(username: String!, email: String!, password: String!): Auth
saveBook(bookData:SaveBookInput!): User
removeBook(bookId: String!): User
}
`;