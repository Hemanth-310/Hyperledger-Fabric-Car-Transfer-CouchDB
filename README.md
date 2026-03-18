```
# Hyperledger Fabric Car Transfer with CouchDB

## Project Overview
Smart contract for car asset transfer built on 
Hyperledger Fabric 2.5 using CouchDB as world state database.

## Folder Structure
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

## Smart Contract Functions
- CreateCar  → Add a new car to the ledger
- ReadCar    → Read a car by ID
- UpdateCar  → Update car details
- DeleteCar  → Remove a car from ledger
- TransferCar → Change car ownership
- GetAllCars  → Get all cars on ledger

## Tech Stack
- Hyperledger Fabric 2.5
- CouchDB world state database
- JavaScript and Node.js
- AND Endorsement Policy (Org1 + Org2)

## Network Setup

### Start network with CouchDB
cd fabric-samples/test-network
./network.sh up createChannel -ca -c mychannel -s couchdb

### Deploy chaincode
./network.sh deployCC -c mychannel -ccn car-transfer \
-ccp ../car-transfer/chaincode-javascript -ccl javascript

### Set environment variables
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="Org1MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org1.example.com/tlsca/tlsca.org1.example.com-cert.pem
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
export CORE_PEER_ADDRESS=localhost:7051

### Short variable for invoke commands
export PEER_FLAGS="-o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile ${PWD}/organizations/ordererOrganizations/example.com/tlsca/tlsca.example.com-cert.pem -C mychannel -n car-transfer --peerAddresses localhost:7051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org1.example.com/tlsca/tlsca.org1.example.com-cert.pem --peerAddresses localhost:9051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org2.example.com/tlsca/tlsca.org2.example.com-cert.pem"

## CRUD Commands

### Create a car
peer chaincode invoke $PEER_FLAGS \
-c '{"function":"CreateCar","Args":["CAR1","Tata","Nexon","Murugan"]}'

### Read a car
peer chaincode query -C mychannel -n car-transfer \
-c '{"Args":["ReadCar","CAR1"]}'

### Update a car
peer chaincode invoke $PEER_FLAGS \
-c '{"function":"UpdateCar","Args":["CAR1","Tata","Harrier","Murugan"]}'

### Transfer ownership
peer chaincode invoke $PEER_FLAGS \
-c '{"function":"TransferCar","Args":["CAR1","Karthikeyan"]}'

### Delete a car
peer chaincode invoke $PEER_FLAGS \
-c '{"function":"DeleteCar","Args":["CAR1"]}'

### Get all cars
peer chaincode query -C mychannel -n car-transfer \
-c '{"Args":["GetAllCars"]}'

## CouchDB World State
| Organization | URL | Port |
|-------------|-----|------|
| Org1 | http://localhost:5984/_utils/ | 5984 |
| Org2 | http://localhost:7984/_utils/ | 7984 |

Login: admin / adminpw
Database: mychannel_car-transfer

## Endorsement Policy
AND Endorsement Policy means both Org1 AND Org2 
must approve every transaction before it is committed.
This ensures no single organization can tamper with data.

## Sample Output
[
  {"id":"CAR1","make":"Tata","model":"Nexon","owner":"Murugan"},
  {"id":"CAR2","make":"Mahindra","model":"Thar","owner":"Selvam"},
  {"id":"CAR3","make":"Maruti","model":"Swift","owner":"Kavitha"}
]
