'use strict';

const { Contract } = require('fabric-contract-api');

class CarTransfer extends Contract {

    // Add 3 sample cars to the ledger
    async InitLedger(ctx) {
        const cars = [
            { id: 'CAR1', make: 'Toyota',  model: 'Camry',   owner: 'Alice'   },
            { id: 'CAR2', make: 'Honda',   model: 'Civic',   owner: 'Bob'     },
            { id: 'CAR3', make: 'Ford',    model: 'Mustang', owner: 'Charlie' },
        ];

        for (const car of cars) {
            await ctx.stub.putState(car.id, Buffer.from(JSON.stringify(car)));
        }
        console.log('Ledger initialized with sample cars');
    }

    // CREATE
    async CreateCar(ctx, id, make, model, owner) {
        const existing = await ctx.stub.getState(id);
        if (existing && existing.length > 0) {
            throw new Error(`Car ${id} already exists`);
        }
        const car = { id, make, model, owner };
        await ctx.stub.putState(id, Buffer.from(JSON.stringify(car)));
        return JSON.stringify(car);
    }

    // READ
    async ReadCar(ctx, id) {
        const carData = await ctx.stub.getState(id);
        if (!carData || carData.length === 0) {
            throw new Error(`Car ${id} not found`);
        }
        return carData.toString();
    }

    // UPDATE
    async UpdateCar(ctx, id, make, model, owner) {
        const existing = await ctx.stub.getState(id);
        if (!existing || existing.length === 0) {
            throw new Error(`Car ${id} not found`);
        }
        const updatedCar = { id, make, model, owner };
        await ctx.stub.putState(id, Buffer.from(JSON.stringify(updatedCar)));
        return JSON.stringify(updatedCar);
    }

    // DELETE
    async DeleteCar(ctx, id) {
        const existing = await ctx.stub.getState(id);
        if (!existing || existing.length === 0) {
            throw new Error(`Car ${id} not found`);
        }
        await ctx.stub.deleteState(id);
        return `Car ${id} has been deleted`;
    }

    // TRANSFER OWNERSHIP
    async TransferCar(ctx, id, newOwner) {
        const carData = await ctx.stub.getState(id);
        if (!carData || carData.length === 0) {
            throw new Error(`Car ${id} not found`);
        }
        const car = JSON.parse(carData.toString());
        car.owner = newOwner;
        await ctx.stub.putState(id, Buffer.from(JSON.stringify(car)));
        return JSON.stringify(car);
    }

    // GET ALL CARS
    async GetAllCars(ctx) {
        const results = [];
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const car = JSON.parse(result.value.value.toString());
            results.push(car);
            result = await iterator.next();
        }
        return JSON.stringify(results);
    }

}

module.exports = CarTransfer;
