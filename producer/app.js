const { Kafka } = require("kafkajs");
const fetch = require("node-fetch");

const CLIENT_ID = process.env.CLIENT_ID || "Bob";
const BROKER_URL = process.env.BROKER_URL || ["localhost:9092"];
const TOPIC = process.env.TOPIC || "chuck-norris-jokes";

// Initialize a new kafka client and initialize a producer from it
const kafka = new Kafka({ CLIENT_ID, BROKER_URL });
const producer = kafka.producer();

// Async function that writes a new message every 3 seconds
const produce = async () => {
  await producer.connect();

  let index = 0;

  setInterval(async () => {
    try {
      let response = await fetch("https://api.chucknorris.io/jokes/random");
      let joke = response.json().value;

      await producer.send({
        TOPIC,
        messages: [
          {
            key: String("Joke" + index),
            value: joke,
          },
        ],
      });

      // if the message is written successfully, log it and increment `i`
      console.log("Writes joke: ", index);
      index++;
    } catch (err) {
      throw new Error("Could not write message " + err);
    }
  }, 3000);
};

produce().catch((err) => {
  throw new Error("Error in producer: ", err);
});
