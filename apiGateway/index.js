import express from 'express';
import {createProxyMiddleware} from 'http-proxy-middleware'

const app = express();

app.use("/user",createProxyMiddleware({
    target : "http://userservice:3000",
    changeOrigin : true
}))

app.use(
  "/tasks",
  createProxyMiddleware({
    target: "http://task-service:8080",
    changeOrigin: true
  })
);

app.listen(5000, () => {
  console.log("API Gateway running on port 5000");
});