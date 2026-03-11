import express from 'express';
import amqp from 'amqplib';

const app = express();

let connection;
let channel;

export async function ConnectRabbitMQwithRetry(retries = 5) {

    while(retries){
        try {

            connection = await amqp.connect("amqp://rabbitmq");

            channel = await connection.createChannel();

            await channel.assertQueue("task_created");

            console.log("Connected to RabbitMQ");

            return channel;

        } catch (error) {

            console.log("Failed to connect to RabbitMQ", error);

            retries--;

            console.log(`Retrying... ${retries} attempts left`);

            await new Promise((res) => setTimeout(res, 5000));
        }
    }
}

export function getChannel(){
    return channel;
}

app.listen(3000, async ()=>{
    console.log("Notification service running");

    await ConnectRabbitMQwithRetry();
});