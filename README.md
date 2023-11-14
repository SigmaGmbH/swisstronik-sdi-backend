# SDI issuer backend

This repository contains sample code of usage agent plugin for Veramo `did:swtr` method. 



## Running

Prerequisites:
- Running Swisstronik Network instance with enabled `did` namespace, accessible `26657` and `8545` ports
- Account on that network with enough SWTR on balance


Configuration:
- Rename file .env.sample to .env
- Configure database via .env file:  
  - sqlite: `DATABASE_URL=sqlite:///absolute/path/to/data/file` or `DATABASE_URL=sqlite://relative/path/to/data/file`
  - postgresql: `DATABASE_URL=postgres://username:password@hostname:port/db_name`

Install all dependencies: `npm install`  
Launch web-server: `npm run run:esm`
