
import { fromBase64 } from "@aws-sdk/util-base64-node";
import { itemsToJson, parseItemsFromJson } from "../itemsJsonConverter";

const items = [
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
    }
];

const itemsJson =
    `[
    {
        "c10": {
            "SS": [
                "random-ss-16998",
                "random-ss-33996"
            ]
        },
        "c2": {
            "BOOL": false
        },
        "c3": {
            "BS": [
                "WNYg4kQaVxU=",
                "8dKxQJaEoMQ="
            ]
        },
        "c4": {
            "L": [
                {
                    "N": "3.14159"
                },
                {
                    "N": "0.618"
                }
            ]
        },
        "c5": {
            "M": {
                "Age": {
                    "N": "34"
                },
                "Name": {
                    "S": "Ross"
                }
            }
        },
        "c6": {
            "N": "1016998"
        },
        "c7": {
            "NS": [
                "17000",
                "16999",
                "16998"
            ]
        },
        "c8": {
            "NULL": true
        },
        "c9": {
            "S": "random-string-16998"
        },
        "id": {
            "N": "16998"
        },
        "c1": {
            "B": "D9w5ApvijXs="
        },
        "primary": {
            "S": "random-value-2021"
        }
    }
]`;

test('itemsToJson', () => {
    const json = itemsToJson(items);
    expect(json).toBe(itemsJson);
});


test('parseItemsFromJson', () => {
    const itemsParsed = parseItemsFromJson(itemsJson);
    expect(itemsParsed).toEqual(items);
});