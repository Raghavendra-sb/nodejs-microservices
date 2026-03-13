import express from 'express';
import {createProxyMiddleware} from 'http-proxy-middleware'
import { authMiddleware } from './authmiddleware.js';

const app = express();

app.use("/user",createProxyMiddleware({
    target : "http://user-service:3000",
    changeOrigin : true
}))

app.use(
  "/tasks",
  authMiddleware,
  createProxyMiddleware({
    target: "http://task-service:8080",
    changeOrigin: true
  })
);

app.listen(5000, () => {
  console.log("API Gateway running on port 5000");
});