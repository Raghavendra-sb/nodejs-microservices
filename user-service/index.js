import express from 'express'
import mongoose from 'mongoose'
import bycrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const app = express();

app.use(express.json());

mongoose.connect("mongodb://mongodb:27017/users")
.then(()=>console.log("Connection successful"))
.catch(err=>console.log("DB connection failed",err));

const userSchema = new mongoose.Schema({
 
    name:String,
    email:String,
    password:String
})

const User = mongoose.model("User",userSchema);

app.get('/',(req,res)=>{
    res.send("Hello")
})

app.post('/register', async (req,res)=>{
    try{

        const {name,email,password} = req.body;

        const hashedPassword = bycrypt.hash(password);



        const user = await User.create({

            name : name,
            email: email,
            password: hashedPassword

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

app.post('/login', async (req,res) => {


    const {email,password} = req.body;

    const user = await User.findOne({email});

    if(!user)
    {
        res.status(404).json({
            message : "User doesnt exist"
        })
    }

    const isMatch = await bycrypt.compare(password,user.password);

    if(!isMatch)
    {
        res.status(401).json({
            message : "Incorrect password"
        })
    }

    const token = jwt.sign(
        { userId: "12345" },
        "8f3c2b9d4e1a7c6f0d2b5a9e3f4c1d7e9b2a6c8d0f1e3b5a7c9d2e4f6a8b1c3",
        { expiresIn: "1h" }
    );

    res.josn(
        {
            success : true,
            token
        }
    )
})

app.listen(3000,()=>{
    console.log("server is up and running")
})