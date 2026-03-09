import express from 'express';
import mongoose from 'mongoose';
import amqp from 'amqplib';

const app = express();

app.use(express.json());

mongoose.connect("mongodb://mongodb:27017/tasks")
.then(()=>{
    console.log("Mongodb connected !");
})
.catch((err)=>{
    console.log("Eroor occured while connectiong mongodb",err);
})

const TaskSchema = new mongoose.Schema({
    title: String,
    description: String,
    userId: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Task =  mongoose.model("Task",TaskSchema); 


app.get('/',(req,res)=>{
    res.send("hello");
})

app.post('/addTask', async (req,res)=>{
    try{

        const {title,description,userId} = req.body;

        const task = await Task.create({
            title,
            description,
            userId
        });

        const message = {
            taskId: task._id,
            userId,
            title
        };

        if(channel){
            channel.sendToQueue(
                "task_created",
                Buffer.from(JSON.stringify(message))
            );
        }

        res.status(200).json({
            success:true,
            task
        });

    }catch(err){
        console.log(err);
        res.status(500).json({
            success:false
        });
    }
});


app.get('/getTasks',async(req,res) =>{
    const tasks = await Task.find();

    res.status(200).json({
        success: true,
        tasks
    })
})

app.listen(8080, ()=>{
    console.log('Server up and running');
})