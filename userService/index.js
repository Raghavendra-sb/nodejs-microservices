import express from 'express'
import mongoose from 'mongoose'

const app = express();

app.use(express.json());

mongoose.connect("mongodb://localhost:27017/users")
.then(()=>console.log("Connection successful"))
.catch(err=>console.log("DB connection failed",err));

const userSchema = new mongoose.Schema({
 
    name:String,
    email:String
})

const User = mongoose.model("User",userSchema);

app.get('/',(req,res)=>{
    res.send("Hello")
})

app.post('/addUser', async (req,res)=>{
    try{

        const {name,email} = req.body;

        const user = await User.create({

            name : name,
            email: email
        })

        await user.save();

        res.status(201).json({
            success:true,
            user
        })

    }catch(err){
        console.log(err)
        res.status(500).json({
            success:false
        })
    }
})

app.get('/getUsers', async (req,res) =>{
    const users = await User.find();

    res.status(200).json({
        success:true,
        users
    })
})

app.delete('/deleteUser/:name', async (req,res) =>{

    const { name } = req.params;

    await User.deleteOne({ name: name });

    res.status(200).json({
        success: true,
        message: "User deleted successfully"
    });

});

app.listen(3000,()=>{
    console.log("server is up and running")
})