import {DataSourceOptions} from "typeorm/data-source/DataSourceOptions";
import 'dotenv/config';

interface Config {
  database: DataSourceOptions
  kms_secret_key: string
  payer_seed: string
  endpoints: {
    rpcUrl: string,
    resolverUrl: string,
    lokiUrl: string |  undefined,
  }
  server: { listenPort: number },
}


function buildDatabaseOptions(url:string):DataSourceOptions{
  const dbUrl = new URL(url);
  switch (dbUrl.protocol) {
    case "sqlite:":
      return {
        type: "sqlite",
        database: dbUrl.host+dbUrl.pathname
      } ;
    case "postgres:":
      return {
        type: "postgres",
        url: url,
      }
    default:
      throw "Only sqlite and postgres are supported, not " + process.env.DATABASE_URL;
  }
}


const config:Config = {
  database: buildDatabaseOptions(process.env.DATABASE_URL!),
  kms_secret_key: process.env.KMS_SECRET_KEY!,
  payer_seed: process.env.PAYER_SEED!,
  endpoints: {
    rpcUrl: process.env.RPC_ENDPOINT!,
    resolverUrl: process.env.EVM_RPC_ENDPOINT!,
    lokiUrl: process.env.LOKI_ENDPOINT,
  },
  server: {
    listenPort: process.env.PORT && Number.parseInt(process.env.PORT) || 3000,
  }
};


export  {config};
