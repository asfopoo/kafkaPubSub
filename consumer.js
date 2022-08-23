const { Kafka } = require("kafkajs");
const WebSocket = require("ws");

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:9092"],
});

const wss = new WebSocket.Server({ host: "0.0.0.0", port: 13000 });

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
};

const topicName = "orderCreated";
const consumerNumber = process.argv[2] || "1";

const processConsumer = async () => {
  const ordersConsumer = kafka.consumer({ groupId: "orders" });
  const paymentsConsumer = kafka.consumer({ groupId: "payments" });
  const notificationsConsumer = kafka.consumer({ groupId: "notifications" });
  await Promise.all([
    ordersConsumer.connect(),
    paymentsConsumer.connect(),
    notificationsConsumer.connect(),
  ]);

  await Promise.all([
    await ordersConsumer.subscribe({ topic: topicName }),
    await paymentsConsumer.subscribe({ topic: topicName }),
    await notificationsConsumer.subscribe({ topic: topicName }),
  ]);

  let orderCounter = 1;
  let paymentCounter = 1;
  let notificationCounter = 1;
  await ordersConsumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      logMessage(
        orderCounter,
        `ordersConsumer#${consumerNumber}`,
        topic,
        partition,
        message
      );
      orderCounter++;
    },
  });
  await paymentsConsumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      logMessage(
        paymentCounter,
        `paymentsConsumer#${consumerNumber}`,
        topic,
        partition,
        message
      );
      paymentCounter++;
    },
  });
  await notificationsConsumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      logMessage(
        notificationCounter,
        `notificationsConsumer#${consumerNumber}`,
        topic,
        partition,
        message
      );
      notificationCounter++;
    },
  });
};

const logMessage = (counter, consumerName, topic, partition, message) => {
  console.log(
    `received a new message number: ${counter} on ${consumerName}: `,
    {
      topic,
      partition,
      message: {
        offset: message.offset,
        headers: message.headers,
        value: message.value.toString(),
      },
    }
  );
  const messageToSocket = `received a new message number: ${counter} on ${consumerName}`;
  // console.log('trying to get socket connection...');
  // sendSocketMessage(messageToSocket);
};

processConsumer();
