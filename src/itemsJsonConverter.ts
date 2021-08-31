
import { AttributeValue } from "@aws-sdk/client-dynamodb";
import { fromBase64, toBase64 } from "@aws-sdk/util-base64-node";


export function itemsToJson(items: { [key: string]: AttributeValue; }[]): string {
    return JSON.stringify(items, replacer, 4);
}

export function parseItemsFromJson(json: string): { [key: string]: AttributeValue; }[] {
    return JSON.parse(json, reviver);
}


function replacer(key: string, value: any) {
    if (value === null || value === undefined) {
        return value;
    }

    if (key === 'B') {
        return toBase64(value as Uint8Array);
    }

    if (key === 'BS') {
        return (value as Uint8Array[]).map(v => toBase64(v));
    }

    return value;
}


function reviver(key: string, value: any) {
    if (value === null || value === undefined) {
        return value;
    }

    if (key == 'B') {
        return fromBase64(value);
    }

    if (key == 'BS') {
        return (value as string[]).map(v => fromBase64(v));
    }

    return value;
}