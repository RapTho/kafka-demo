const { Kafka, logLevel } = require("kafkajs");
const fs = require("fs");

if (process.env.NODE_ENV === "dev") require("dotenv").config();

const CLIENT_ID = process.env.CLIENT_ID || "Alice";
const BROKER_URL = JSON.parse(process.env.BROKER_URL) || ["localhost:9092"];
const TOPICS = JSON.parse(process.env.TOPICS) || ["topic1"];
const FROM_BEGINNING = Boolean(process.env.FROM_BEGINNING) || false;
const GROUP_ID = process.env.GROUP_ID || "myConsumer";
const CERT_PATH = process.env.CERT_PATH || "cert.pem";
const UN = process.env.KAFKA_USERNAME || "consumer";
const PW = process.env.KAFKA_PASSWORD || "myPassword";

const kafka = new Kafka({
  clientId: CLIENT_ID,
  brokers: BROKER_URL,
  ssl: {
    rejectUnauthorized: false,
    cert: fs.readFileSync(CERT_PATH, "utf-8"),
  },
  sasl: {
    username: UN,
    password: PW,
    mechanism: "scram-sha-512",
  },
  logLevel: logLevel.ERROR,
});

const consumer = kafka.consumer({
  groupId: GROUP_ID,
});

const consume = async () => {
  await consumer.connect();
  console.log("Consumer connected to Kafka broker");

  await consumer.subscribe({ topics: TOPICS, fromBeginning: FROM_BEGINNING });

  await consumer.run({
    autoCommitInterval: 2000,
    eachMessage: async ({ topic, partition, message, heartbeat }) => {
      console.log({
        key: message.key.toString(),
        value: message.value.toString(),
      });
    },
  });
};

consume().catch((err) => {
  throw new Error(err);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM signal received. Closing application");
  process.exit(0);
});
