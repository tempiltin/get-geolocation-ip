require("dotenv").config();
const express = require('express')
const cors = require('cors')
const checkIpRouter = require("./router/checkIp");
const app = express();

app.use(cors());
app.use(express.json());


app.use("/api/v1/", checkIpRouter);

const PORT = process.env.PORT || 3002;

app.listen( PORT, ()=> console.log(`Server ishga tushdi ! http://localhost:${PORT}`) )







