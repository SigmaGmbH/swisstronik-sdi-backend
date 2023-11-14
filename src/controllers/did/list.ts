import {agent} from "../agent";
import {IIdentifier} from "@veramo/core";


async function list():Promise<IIdentifier[]> {
  return await agent.didManagerFind();
}

export { list };
