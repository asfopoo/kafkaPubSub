var express = require("express");
var express_graphql = require("express-graphql").graphqlHTTP;

const schema = require("./schema");
const resolvers = require("./resolvers");
const processConsumer = require("./consumer");

var root = {
  course: resolvers.exports.getCourse,
  courses: resolvers.exports.getCourses,
  updateCourseTopic: resolvers.exports.updateCourseTopic, // rename me
  createNewTopic: resolvers.exports.createNewTopic,
  coarseUpdated: resolvers.exports.coarseUpdated,
};

console.log('starting consumer...');
processConsumer();

// Create an express server and a GraphQL endpoint
var app = express();
app.use(
  "/graphql",
  express_graphql({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);
app.listen(4001, () =>
  console.log(
    "Starting Server On localhost:4001/graphql ...."
  )
);





// const WebSocket = require("ws");
/* const wss = new WebSocket.Server({ host: "0.0.0.0", port: 13000 });

const sendSocketMessage = (message) => {
  wss.on("connection", function connection(ws) {
    console.log("new connection");

    ws.on("message", function incoming(message) {
      console.log("received: %s", message);
    });

    ws.on("error", function (e) {
      console.log("error", e);
    });

    ws.on("close", function (e) {
      console.log("close", e);
    });

    ws.send("connection opened");
    ws.send(message);
  });
}; */

// const messageToSocket = `received a new message number: ${counter} on ${consumerName}`;
  // console.log('trying to get socket connection...');
  // sendSocketMessage(messageToSocket);
