
import express from 'express'
import correlationMw from "express-correlation-id"
import {config} from "./config";
import {router} from "./routers/did";
import {logger} from "./log";

const app = express();

app.use(correlationMw());
app.use(express.json());
app.use("/did", router);

app.listen(config.server.listenPort, ()=>{
  logger.info(`Listening in localhost:${config.server.listenPort}...`);
})

export {}
