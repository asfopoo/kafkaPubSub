const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9092']
});

const processProducer = async ({topicName, message}) => {
    const msg = JSON.stringify(message);
    const producer = kafka.producer();
    await producer.connect();
    for (let i = 0; i < 3; i++) {
        await producer.send({
            topic: topicName,
            messages: [
                { value: msg },
            ],
        });
    }
    await producer.disconnect();
};

module.exports = processProducer;
