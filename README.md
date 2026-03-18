# Hyperledger Fabric Car Transfer with CouchDB

## Project Overview

This project implements a Car Asset Transfer smart contract on Hyperledger Fabric 2.5. It allows two organizations to create, read, update, delete and transfer ownership of car assets on a blockchain network. CouchDB is used as the world state database.

---

## Folder Structure
```
chaincode-javascript/
├── index.js
├── package.json
├── lib/
│   └── carTransfer.js
└── META-INF/
    └── statedb/
        └── couchdb/
            └── indexes/
                └── indexOwner.json
```

---

## Smart Contract Functions

| Function | Type | Description |
|----------|------|-------------|
| CreateCar | Write | Add a new car to the ledger |
| ReadCar | Read | Get a car by ID |
| UpdateCar | Write | Update car details |
| DeleteCar | Write | Remove a car from ledger |
| TransferCar | Write | Change car ownership |
| GetAllCars | Read | Get all cars on ledger |

---

## Tech Stack

- Hyperledger Fabric 2.5
- CouchDB as world state database
- JavaScript and Node.js
- AND Endorsement Policy — Org1 + Org2

---

## How to Run

### 1. Start the network with CouchDB
```bash
cd fabric-samples/test-network
./network.sh up createChannel -ca -c mychannel -s couchdb
```

### 2. Deploy the chaincode
```bash
./network.sh deployCC -c mychannel -ccn car-transfer -ccp ../car-transfer/chaincode-javascript -ccl javascript
```

### 3. Set environment for Org1
```bash
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="Org1MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org1.example.com/tlsca/tlsca.org1.example.com-cert.pem
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
export CORE_PEER_ADDRESS=localhost:7051
```

### 4. Set short variable
```bash
export PEER_FLAGS="-o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile ${PWD}/organizations/ordererOrganizations/example.com/tlsca/tlsca.example.com-cert.pem -C mychannel -n car-transfer --peerAddresses localhost:7051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org1.example.com/tlsca/tlsca.org1.example.com-cert.pem --peerAddresses localhost:9051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org2.example.com/tlsca/tlsca.org2.example.com-cert.pem"
```

---

## CRUD Commands

### Create a car
```bash
peer chaincode invoke $PEER_FLAGS -c '{"function":"CreateCar","Args":["CAR1","Tata","Nexon","Murugan"]}'
```

### Read a car
```bash
peer chaincode query -C mychannel -n car-transfer -c '{"Args":["ReadCar","CAR1"]}'
```

### Read all cars
```bash
peer chaincode query -C mychannel -n car-transfer -c '{"Args":["GetAllCars"]}'
```

### Update a car
```bash
peer chaincode invoke $PEER_FLAGS -c '{"function":"UpdateCar","Args":["CAR1","Tata","Harrier","Murugan"]}'
```

### Transfer ownership
```bash
peer chaincode invoke $PEER_FLAGS -c '{"function":"TransferCar","Args":["CAR1","Karthikeyan"]}'
```

### Delete a car
```bash
peer chaincode invoke $PEER_FLAGS -c '{"function":"DeleteCar","Args":["CAR1"]}'
```

---

## CouchDB World State

| Organization | URL | Port |
|-------------|-----|------|
| Org1 | http://localhost:5984/_utils/ | 5984 |
| Org2 | http://localhost:7984/_utils/ | 7984 |

- Login: `admin` / `adminpw`
- Database: `mychannel_car-transfer`

---

## Endorsement Policy

This network uses AND Endorsement Policy which means both Org1 and Org2 must approve every transaction before it is committed to the ledger. This ensures no single organization can tamper with the data.

---

## Sample Output
```json
[
  {"id":"CAR1","make":"Tata","model":"Nexon","owner":"Murugan"},
  {"id":"CAR2","make":"Mahindra","model":"Thar","owner":"Selvam"},
  {"id":"CAR3","make":"Maruti","model":"Swift","owner":"Kavitha"}
]
```
