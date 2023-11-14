import {Request, Response} from "express";
import {create as createController} from "../controllers/did/create"
import {list as listController} from "../controllers/did/list"
import {logger} from "../log";


const create = async (request: Request, response: Response) => {
  let payload: any = null, error: any = null;
  logger.info("Started did view",{payload: JSON.stringify(request.body)})
  try {
    payload = await createController(request.body);
  } catch (e) {
    error = e;
  }
  logger.info("Finished did view")
  response.json({error, result: payload})
};


const list = async (request: Request, response: Response) => {
  logger.info("Started list view", {c:request['correlationId']});
  let result: any = null, error: any = null;

  try {
    let identifiers = await listController();

    result = identifiers.map(i => ({
      did: i.did,
      keys: i.keys.map(key => ({
        publicKeyHex: key.publicKeyHex,
        type: key.type
      }))
    }));
  } catch (e) {
    error = e
  }
  response.json({
    result, error
  });
};


export {create, list};
