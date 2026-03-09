import express from 'express'
import mongoose from 'mongoose'
import amqp from 'amqplib'

const app = express();

let connection;
let channel;

async function ConnectRabbitMQwithRetry(retires = 5) {
    while(retires)
    {
        try {
            connection = await amqp.connect("amqp://rabbitmq");
            channel = await connection.createChannel();
            await channel.assertQueue("task_created");
            console.log("Connected to RabbitMQ");
            return;
        } catch (error) {
            console.log("Failed to connect to RabbitMQ",error);
            retires--;
            console.log(`Retrying... ${retires} attempts left`);
            await new Promise((res) => setTimeout(res, 5000 ));//wts res 
            
        }
    }
}

app.listen(3000,()=>{
    console.log("server is up and running")
    ConnectRabbitMQwithRetry();
})