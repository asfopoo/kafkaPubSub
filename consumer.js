const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:9092"],
});

const pubsub = require('./pubsub');

const topicName = "courseUpdate";
const consumerNumber = process.argv[2] || "1";

// You can have multiple consumers for the same topic -> mutliple things need to happend when the event gets triggered
const processConsumer = async () => {
  const coarseUpdateConsumer = kafka.consumer({ groupId: "coarseUpdates" });
  /* more consumers here */
  await Promise.all([
    coarseUpdateConsumer.connect(),
    /* more consumer promises here */
  ]);

  await Promise.all([
    await coarseUpdateConsumer.subscribe({ topic: topicName }),
    /* more here */
  ]);

  await coarseUpdateConsumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      logMessage(
        `coarseUpdateConsumer#${consumerNumber}`,
        topic,
        partition,
        message
      );
      // publish message to graphql subscription
      pubsub.publish('COARSE_UPDATED', message.value); 
    },
  });
  /* run more consumers here */
};

const logMessage = (consumerName, topic, partition, message) => {
  console.log(
    `received a new message from consumer ${consumerName} listening to topic: ${topic}, in partition: ${partition} message as follows: `,
    {
      message: {
        offset: message.offset,
        headers: message.headers,
        value: message.value.toString(),
      },
    }
  );
};

module.exports = processConsumer;
