# kafka-demo

Small kafka demo that includes a producer and a consumers

### How to get started

You need any container engine installed on your system and a running Kafka cluster. This example shows docker but others like podman will work the same.

Clone the gitub repository

```
git clone https://github.com/RapTho/kafka-demo
```

### Producer

Build the container

```
cd producer
docker build -t producer:1.0 .
```

Run the producer application and enter your environment variables

```
docker run -d \
    --name producer \
    -e CLIENT_ID=Bob \
    -e BROKER_URL=["localhost:9092"] \
    -e TOPIC=topic1 \
    -e CERT_PATH=cert.pem \
    -e KAFKA_USERNAME=producer \
    -e KAFKA_PASSWORD=myPassword \
    producer:1.0
```

### Consumer

Build the container

```
cd consumer
docker build -t consumer:1.0 .
```

Run the producer application and enter your environment variables

```
docker run -d \
    --name consumer \
    -e CLIENT_ID=Alice \
    -e BROKER_URL=["localhost:9092"] \
    -e TOPICS=["topic1"] \
    -e FROM_BEGINNING=false \
    -e GROUP_ID=myConsumer \
    -e CERT_PATH=cert.pem \
    -e KAFKA_USERNAME=consumer \
    -e KAFKA_PASSWORD=myPassword \
    consumer:1.0
```
