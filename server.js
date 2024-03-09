const express = require("express")
const app = express()
const server = require("http").createServer(app);
const dotenv = require("dotenv")
dotenv.config()












const port = process.env.PORT || 5500
server.listen(port,()=>{console.log(`Listening on ${port}`)})