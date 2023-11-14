import winston, {transports, format} from "winston"
import LokiTransport from "winston-loki"
import correlator from "express-correlation-id";
import {config} from "./config";
import TransportStream from "winston-transport";


let trans:TransportStream[] = [
  new transports.Console({
    format: format.combine(format.simple(), format.colorize()),
    level:"silly"
  })
];

if (config.endpoints.lokiUrl) {
  trans.push(
    new LokiTransport({
      host: config.endpoints.lokiUrl,
      labels: {
        source: 'sdi-node',
        Environment: "Staging"
      },
      json: true,
      format: winston.format.combine(
        winston.format((record) => {
          record.CorrelationId = correlator.getId();
          return record;
        })(),
        winston.format.timestamp(),
        winston.format.errors({stack: true}),
        winston.format.splat(),
        winston.format.json()
      ),
      // replaceTimestamp: true,
      onConnectionError: (err) => console.error(err),
      level: "silly"
    })
  );
}


const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.errors({stack: true}),
    winston.format.splat(),
    winston.format.json()
  ),
  exitOnError: false,
  transports: trans,
});

export {logger}
