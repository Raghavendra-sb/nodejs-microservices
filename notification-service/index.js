import amqp from "amqplib";

let connection;
let channel;

async function connectRabbitMQ(retries = 10) {

    while(retries) {

        try {

            connection = await amqp.connect("amqp://rabbitmq");

            channel = await connection.createChannel();

            await channel.assertQueue("task_created", { durable: true });

            console.log("Notification Service connected to RabbitMQ");

            channel.consume("task_created", (msg) => {

                const taskData = JSON.parse(msg.content.toString());

                console.log("📩 New Task Notification:", taskData.title);

                console.log(taskData);

                channel.ack(msg);

            });

            return;

        } catch(err) {

            console.log("RabbitMQ not ready, retrying...", retries);

            retries--;

            await new Promise(res => setTimeout(res, 5000));
        }
    }
}

connectRabbitMQ();