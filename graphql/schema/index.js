const { buildSchema } = require('graphql');

module.exports = buildSchema(`
type Assign {
    _id: ID!
    subject: Subject!
    student: Student!
    createdAt: String!
    updatedAt: String!
}

type Subject {
  _id: ID!
  title: String!
  creator: Student!
}

type Student {
  _id: ID!
  name: String!
  email: String!
  phone: String!
  password: String
  date: String!
  createdSubjects: [Subject!]
}

type AuthData {
  studentId: ID!
  token: String!
  tokenExpiration: Int!
}

input SubjectInput {
    title:String!
}

input StudentInput {
  name: String!
  email: String!
  phone: String!
  password: String!
  date: String!
}

type RootQuery {
    subjects: [Subject!]!
    assign: [Assign!]!
    login(email: String!, password: String!): AuthData!
}

type RootMutation {
    createSubject(subjectInput: SubjectInput): Subject
    createStudent(studentInput: StudentInput): Student
    assignSubject(subjectId: ID!): Assign!
    cancelAssign(assignId: ID!): Subject!
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);
