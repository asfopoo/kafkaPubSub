const coursesData = require("./courseData");
const createTopic = require("./createTopic");
const processProducer = require("./producer");
const pubsub = require('./pubsub');

const resolvers = {
  Query: {
    getCourse: () => {
      var id = args.id;
      return coursesData.filter((course) => {
        return course.id == id;
      })[0];
    },
    getCourses: (args) => {
      var id = args.id;
      return coursesData.filter((course) => {
        return course.id == id;
      })[0];
    },
  },
  Mutation: {
    updateCourseTopic: (_, { id, topic }) => {
      // map the courses
      coursesData.map((course) => {
        if (course.id === id) {
          // update the coarse topic
          course.topic = topic;
          return course;
        }
      });

      // grab the changed coarse
      const updatedCoarse = coursesData.filter((course) => course.id === id)[0];
      const message = { coarseId: updatedCoarse };
      const topicName = "courseUpdate";

      processProducer({ topicName, message })
        .then(() => {
          console.log("producer sent message successfully");
        })
        .catch((err) => {
          console.log("error in producer", err);
        });

      return coursesData.filter((course) => course.id === id)[0];
    },
    createNewTopic: (_, { topicName }) => {
      // create new topic using kafka
      createTopic(topicName)
        .then((res) => {
          console.log(`${topicName} topic created: `, res);
          return { success: true };
        })
        .catch((err) => {
          console.log(err, "err");
          return { success: false };
        });
    },
  },
  Subscription: {
    coarseUpdated: {
        // listen for a pubsub to publish with label: COARSE_UPDATED
        subscribe: () => pubsub.asyncIterator(['COARSE_UPDATED'])
    },
  },
};

module.exports = resolvers;
