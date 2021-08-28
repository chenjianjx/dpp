#!/usr/bin/env node

const { exec } = require('child_process');

function itemToPutRequest(item){
    return {PutRequest: {Item: item}};
}

async function batchWriteItem(items) {
    const putRequests = items.map(itemToPutRequest);
    const requestItems = {DppTest: putRequests};
    // console.log(JSON.stringify(requestItems));

    await exec("aws dynamodb batch-write-item --request-items '" + JSON.stringify(requestItems) + "'", (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return;
        }
        // the *entire* stdout and stderr (buffered)
        console.log(`${stdout}`);
        console.error(`${stderr}`);
    });
}



let items = [];
for (let i = 1; i <= 20000; i++) {
    
    const item = {
        id: { "N": i.toString()},
        c1: { "B": Math.random() < 0.5 ? "dGhpcyB0ZXh0IGlzIGJhc2U2NC1lbmNvZGVk" : "SuIAKIx1PQg9yfzZMsbapA==" },
        c2: { "BOOL": Math.random() < 0.5 },
        c3: { "BS": Math.random() < 0.5 ? ["U3Vubnk=", "UmFpbnk="] : ["rNse26E2c7k=", "FzN/CnM+//U="] },
        c4: { "L": Math.random() < 0.5 ? [{ "S": "Cookies" }, { "S": "Coffee" }] : [{ "N": "3.14159" }, { "N": "0.618" }] },
        c5: { "M": Math.random() < 0.5 ? { "Name": { "S": "Joe" }, "Age": { "N": "35" } } : { "Name": { "S": "Ross" }, "Age": { "N": "34" } } },
        c6: { "N": (1000000 + i).toString() },
        c7: { "NS": [i.toString(), (i + 1).toString(), (i + 2).toString()] },
        c8: { "NULL": true},
        c9: { "S": "random-string-" + i },
        c10: { "SS": ["random-ss-" + i, "random-ss-" + i * 2] },
        primary: { "S": "random-value-of-illegal-column-name" + i }
    }
    items.push(item);

    if(i % 25 === 0){
        console.log("Send items with endIndex = " + i);
        batchWriteItem(items);
        items = [];
    }
    
   
}


/// finally add a row which has a new column 
const itemWithNewColumn = {
    id: { "N": new Date().getTime().toString() },
    c99: { "S": "Extra column value" },
}
batchWriteItem([itemWithNewColumn]);