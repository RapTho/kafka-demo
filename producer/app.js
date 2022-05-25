const { Kafka, CompressionTypes, logLevel } = require("kafkajs");
const fs = require("fs");

if (process.env.NODE_ENV === "dev") require("dotenv").config();

const CLIENT_ID = process.env.CLIENT_ID || "Bob";
const BROKER_URL = JSON.parse(process.env.BROKER_URL) || ["localhost:9092"];
const TOPIC = process.env.TOPIC || "topic1";
const CERT_PATH = process.env.CERT_PATH || "../kafka_files/cert.pem";
const UN = process.env.KAFKA_USERNAME || "producer";
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

const producer = kafka.producer({
  allowAutoTopicCreation: false,
  transactionTimeout: 30000,
});

const produce = async () => {
  await producer.connect();
  console.log("Producer connected to Kafka broker");

  let index = 0;

  setInterval(async () => {
    try {
      const startTimer = Date.now();

      await producer.send({
        topic: TOPIC,
        compression: CompressionTypes.GZIP,
        messages: [
          {
            key: CLIENT_ID,
            value: `Message number ${index}`,
            timestamp: Date.now(),
          },
        ],
      });

      const endTimer = Date.now();

      console.log(`Wrote msg # ${index}\nTook ${endTimer - startTimer} ms\n\n`);
      index++;
    } catch (err) {
      throw new Error(err);
    }
  }, 3000);
};

produce().catch((err) => {
  throw new Error(err);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM signal received. Closing application");
  process.exit(0);
});
