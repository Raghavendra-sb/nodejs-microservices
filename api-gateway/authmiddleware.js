import jwt from "jsonwebtoken";

export const authMiddleware = (req,res,next)=>{

 const authHeader = req.headers.authorization;

 if(!authHeader){
   return res.status(401).json({message:"No token"});
 }

 const token = authHeader.split(" ")[1];

 if(!token){
   return res.status(401).json({message:"Invalid token format"});
 }

 try{

   const decoded = jwt.verify(
  token,
  "8f3c2b9d4e1a7c6f0d2b5a9e3f4c1d7e9b2a6c8d0f1e3b5a7c9d2e4f6a8b1c3"
);
   req.user = decoded;
   req.headers["x-user-id"] = decoded.userId;

   next();

 }catch(err){
   return res.status(401).json({message:"Invalid token"});
 }

};