import express from "express";
import mongoose from "mongoose";
import amqp from "amqplib";

const app = express();
app.use(express.json());


/* ---------------- MongoDB ---------------- */

mongoose
  .connect("mongodb://mongodb:27017/tasks")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Mongo error:", err));

const TaskSchema = new mongoose.Schema({
  title: String,
  description: String,
  userId: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Task = mongoose.model("Task", TaskSchema);

let channel , connection;
/* ---------------- RabbitMQ ---------------- */

async function connectRabbitMQRetries(retries = 5, delay = 5000) {

    while(retries)
    {
        try{
            connection = await amqp.connect("amqp://rabbitmq");
        channel = await connection.createChannel();
        await channel.assertQueue("task_created", { durable: true });

        console.log("Task Service connected to RabbitMQ");
        return;

        }
        catch(err)
        {
            console.log("RabbitMQ connection error:", err.message);
            console.log("RabbitMQ connection error, retries left:", retries -1);
            retries--;
            await new Promise(res => setTimeout(res, delay));   
        }
        
    }
}

/* ---------------- Routes ---------------- */

app.post("/addTask", async (req, res) => {
  try {
    const { title, description, userId } = req.body;

    const task = await Task.create({
      title,
      description,
      userId,
    });

    const message = {
      taskId: task._id,
      title,
      userId,
    };

    if (channel) {
      channel.sendToQueue(
        "task_created",
        Buffer.from(JSON.stringify(message)),
        { persistent: true }
      );

      console.log("Task event sent:", message);
    }

    res.json({
      success: true,
      task,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
});

app.get("/getTasks", async (req, res) => {
  const tasks = await Task.find();

  res.json({
    success: true,
    tasks,
  });
});

/* ---------------- Server ---------------- */

app.listen(8080, async () => {
  console.log("Task Service running on port 8080");

   connectRabbitMQRetries();
});