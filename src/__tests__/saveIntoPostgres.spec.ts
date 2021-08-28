import { AttributeValue } from "@aws-sdk/client-dynamodb";
import { extractColumnNames, toInsertQuery } from "../saveIntoPostgres";
import {fromBase64} from "@aws-sdk/util-base64-node"


test('extractColumnNames', () => {
    const item1: { [key: string]: AttributeValue; } = {
        c1: { SS: ['random-ss-16998', 'random-ss-33996'] },
        c2: { BOOL: false },
    };

    const item2: { [key: string]: AttributeValue; } = {
        c2: { NS: ['17000', '16999', '16998'] },
        c3: { N: '1016998' },
    };

    const columnNames: Set<string> = extractColumnNames([item1, item2]);

    expect(columnNames.size).toBe(3);
    expect(columnNames.has("c1")).toBeTruthy();
    expect(columnNames.has("c2")).toBeTruthy();
    expect(columnNames.has("c3")).toBeTruthy();
});



test('toInsertQuery', () => {
    const tableName = "test_table";
    const item =
    {
        "c10": { "SS": ["random-ss-16998", "random-ss-33996"] },
        "c2": { "BOOL": false },
        "c3": { "BS": [fromBase64("WNYg4kQaVxU="), fromBase64("8dKxQJaEoMQ=")] },
        "c4": { "L": [{ "N": "3.14159" }, { "N": "0.618" }] },
        "c5": { "M": { "Age": { "N": "34" }, "Name": { "S": "Ross" } } },
        "c6": { "N": "1016998" },
        "c7": { "NS": ["17000", "16999", "16998"] },
        "c8": { "NULL": true },
        "c9": { "S": "random-string-16998" },
        "id": { "N": "16998" },
        "c1": { "B": fromBase64("D9w5ApvijXs=") },
        "primary": { "S": "random-value-2021" }
    };

    const iq = toInsertQuery(tableName, {"primary": "primary_new"}, item);
    expect(iq.sql).toBe("insert into test_table(c10,c2,c3,c4,c5,c6,c7,c8,c9,id,c1,primary_new) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)");
    // console.log(iq.values[2]);
    expect(iq.values).toStrictEqual([
        '["random-ss-16998","random-ss-33996"]',
        'false',
        '["WNYg4kQaVxU=","8dKxQJaEoMQ="]',
        '["3.14159","0.618"]',
        '{"Age":"34","Name":"Ross"}',
        '1016998',
        '["17000","16999","16998"]',
        null,
        'random-string-16998',
        '16998',
        'D9w5ApvijXs=',
        'random-value-2021'
    ]
    );

});