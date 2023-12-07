
// Core interfaces
import {
  createAgent,
  IDIDManager,
  IResolver,
  IDataStore,
  IDataStoreORM,
  IKeyManager,
  ICredentialPlugin,
} from '@veramo/core'

// Core identity manager plugin
import { DIDManager } from '@veramo/did-manager'

// DID identity provider
// import { SwisstronikDIDProvider, getResolver as swisstronikResolver} from '../tools/did-manager'
import { SwisstronikDIDProvider, getResolver as swisstronikResolver } from '../veramo-did-provider'

// Core key manager plugin
import { KeyManager } from '@veramo/key-manager'

// Custom key management system for RN
import { KeyManagementSystem, SecretBox } from '@veramo/kms-local'

// W3C Verifiable Credential plugin
import { CredentialPlugin, ICredentialIssuer, ICredentialVerifier  } from '@veramo/credential-w3c'

// Custom resolvers
import { DIDResolverPlugin } from '@veramo/did-resolver'
import { Resolver } from 'did-resolver'

// Storage plugin using TypeOrm
import { Entities, KeyStore, DIDStore, PrivateKeyStore, migrations } from '@veramo/data-store'

// TypeORM is installed with `@veramo/data-store`
import { DataSource } from 'typeorm'

import {config} from "../config";

const dbConnection = new DataSource({
  ...config.database,
  synchronize: false,
  migrations,
  migrationsRun: true,
  logging: ['error', 'info', 'warn'],
  entities: Entities,
}).initialize()

export const agent = createAgent<IDIDManager & IKeyManager & IDataStore & IDataStoreORM & IResolver & ICredentialPlugin & ICredentialIssuer & ICredentialVerifier>({
  plugins: [
    new KeyManager({
      store: new KeyStore(dbConnection),
      kms: {
        local: new KeyManagementSystem(new PrivateKeyStore(dbConnection, new SecretBox(config.kms_secret_key))),
      },
    }),
    new DIDManager({
      store: new DIDStore(dbConnection),
      defaultProvider: 'did:swtr',
      providers: {
        'did:swtr': new SwisstronikDIDProvider({
          defaultKms: 'local',
          cosmosPayerSeed: config.payer_seed,
          rpcUrl: config.endpoints.rpcUrl,
        }),
      },
    }),
    new DIDResolverPlugin({
      resolver: new Resolver({
        ...swisstronikResolver({url: config.endpoints.resolverUrl}),
      }),
    }),
    new CredentialPlugin(),
  ]
})

