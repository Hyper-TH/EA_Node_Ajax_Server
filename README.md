## Prerequisites
- Node.js v18.18.0
- A Firebase account
- A front end: [EA_Node_Ajax](https://github.com/Hyper-TH/EA_Node_Ajax).
- A cup of tea

## Install dependendcies
```
npm install @google-cloud/firestore
npm install axios
npm install cors
npm install dotenv
npm install express
npm install firebase firebase-admin
npm install mongoose mongodb
npm install nodemon
```
# Please have the following ready before proceeding:

## Firestore Collections
- users

## MongoDB Database
- ea_ca

## MongoDB Collections
- products
- categories
- users


### Firebase config

Within your Firebase console, go to:

`Project settings`

Below the `Your project` section is another section called `Your apps`

Copy the SDK setup and configuration.

Paste this into `mock_files/mock_config.json`

Note that it's preferrable to rename these according to the way it's imported within `server.js`

## Environment variables
Use the `.env.example` file as a template (and remove `.example`). All of the environment variable values can be found within your `config.js` from your Firebase account. The `REACT_APP_LOCALHOST` variable can be your `localhost` domain or your deployed link.

## To run the server
```
nodemon server.js
```