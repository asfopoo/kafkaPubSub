const { ApolloServer } = require("apollo-server-express");
const { createServer } = require("http");
const {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} = require("apollo-server-core");
const express = require('express');
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { WebSocketServer } = require("ws");
const { useServer } = require("graphql-ws/lib/use/ws");

const typeDefs = require("./schema");
const resolvers = require("./resolvers");
const processConsumer = require("./consumer");

// Create the schema, which will be used separately by ApolloServer and
// the WebSocket server.
const schema = makeExecutableSchema({ typeDefs, resolvers });

// Create an Express app and HTTP server; we will attach both the WebSocket
// server and the ApolloServer to this HTTP server.
const app = express();
const httpServer = createServer(app);

// Create our WebSocket server using the HTTP server we just set up.
const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/graphql",
});
// Save the returned server's info so we can shutdown this server later
const serverCleanup = useServer({ schema }, wsServer);

// Set up ApolloServer.
const server = new ApolloServer({
  schema,
  csrfPrevention: true,
  cache: "bounded",
  plugins: [
    // Proper shutdown for the HTTP server.
    ApolloServerPluginDrainHttpServer({ httpServer }),

    // Proper shutdown for the WebSocket server.
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
    ApolloServerPluginLandingPageLocalDefault({ embed: true }),
  ],
});

const startServerAsync = async () => {
  await server.start();
  server.applyMiddleware({ app });
};

startServerAsync();


const PORT = 4000;
// Now that our HTTP server is fully set up, we can listen to it.
httpServer.listen(PORT, () => {
  console.log(
    `Server is now running on http://localhost:${PORT}${server.graphqlPath}`
  );
  console.log("starting consumer...");
  processConsumer();
});

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
