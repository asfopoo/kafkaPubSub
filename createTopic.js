const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9092']
});

// will resolve to true if the topic was created successfully or false if it already exists.
const createTopic = async (topicName) => {
    const admin = kafka.admin();
    await admin.connect();
    const topicResponse = await admin.createTopics({
        topics: [{
            topic: topicName,
            numPartitions: 2,
            replicationFactor: 1
        }
        ],
});
    await admin.disconnect();
    return topicResponse;
};

module.exports = createTopic;
