import {
  createDidVerificationMethod,
  createVerificationKeys,
  createDidPayload,
  MethodSpecificIdAlgo,
  VerificationMethods, DIDDocumentExternal,
} from '../../sdk'


import {
  ProofType, UnsignedCredential,

} from '@veramo/core'

import {agent} from "../agent";

import {logger} from "../../log";

/**
 * GET /
 * Home page.
 */
const create = async (extra_payload:any): Promise<UnsignedCredential & { proof: ProofType }> => {
  logger.info(`Started controller`, {payload:extra_payload});
  const document = await createDefaultDIDDocument()
  logger.debug("Created document");
    const identifier = await agent.didManagerCreate({
      provider: 'did:swtr',
      options: { document },
    })
    logger.debug("Created DID for issuer: ", identifier);

  const credentialSubject = {
    id: document.id,
    kycPassed: true,
    ...extra_payload
  }
  console.log('Credential subject: ', credentialSubject)

  try {
    const credential = await agent.createVerifiableCredential({
      credential: {
        issuer: { id: document.id },
        credentialSubject,
      },
      proofFormat: 'jwt',
    });
    logger.debug("Created creds");
    return credential;
  } catch (error) {
    logger.debug("Cannot create VC. Reason: ", error)
  }

  return Promise.reject()
};

const createDefaultDIDDocument = async (): Promise<DIDDocumentExternal> => {
  // Add key to KMS
  const key = await agent.keyManagerCreate({ kms: 'local', type: 'Ed25519' })

  // Create verification material
  const vmKeys = createVerificationKeys(key.publicKeyHex, MethodSpecificIdAlgo.Base58, `${key.kid}-1`)
  const vmMethods = createDidVerificationMethod([VerificationMethods.Ed255192020], [vmKeys])

  // Construct DID document
  const payload =  createDidPayload(vmMethods, [vmKeys]);
  return payload;
}

export { create};
