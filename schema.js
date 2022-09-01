const { gql } = require('apollo-server');

const typeDefs = gql`
    type Query {
        getCourse(id: Int!): Course
        getCourses(topic: String): [Course]
    }
    type Mutation {
        updateCourseTopic(id: Int!, topic: String!): Course
        createNewTopic(topicName: String!): Success
    }
    type Subscription {
        coarseUpdated: Course
    }
    type Course {
        id: Int
        title: String
        author: String
        description: String
        topic: String
        url: String
    }
    type Success {
        response: Boolean
    }
`;

module.exports = typeDefs;