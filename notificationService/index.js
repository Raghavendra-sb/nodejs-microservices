import express from "express";
import amqp from "amqplib";

const app = express();

let channel;

async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect("amqp://rabbitmq");

    channel = await connection.createChannel();

    await channel.assertQueue("task_created", { durable: true });

    console.log("Notification Service connected to RabbitMQ");

    channel.consume("task_created", (msg) => {
      const data = JSON.parse(msg.content.toString());

      console.log("Notification received for task:", data);

      // Example notification logic
      console.log(
        `Send notification → User ${data.userId} created task "${data.title}"`
      );

      channel.ack(msg);
    });

  } catch (err) {
    console.log("RabbitMQ error:", err);
  }
}

app.listen(3000, async () => {
  console.log("Notification Service running");

  await connectRabbitMQ();
});