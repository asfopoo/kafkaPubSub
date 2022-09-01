var express = require("express");
const { ApolloServer } = require('apollo-server');

const typeDefs = require("./schema");
const resolvers = require("./resolvers");
const processConsumer = require("./consumer");

const {
    ApolloServerPluginLandingPageLocalDefault
  } = require('apollo-server-core');
  
  // The ApolloServer constructor requires two parameters: your schema
  // definition and your set of resolvers.
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    cache: 'bounded',
    /**
     * These are our recommended settings for using AS;
     * they aren't the defaults in AS3 for backwards-compatibility reasons but
     * will be the defaults in AS4. For production environments, use
     * ApolloServerPluginLandingPageProductionDefault instead.
    **/
    plugins: [
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
  });
  
  // The `listen` method launches a web server.
  server.listen().then(({ url }) => {
    console.log(`🚀  Server listening at ${url}`);
    console.log('starting consumer...');
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
