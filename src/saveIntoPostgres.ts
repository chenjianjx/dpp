
import { AttributeValue } from "@aws-sdk/client-dynamodb";
import { toBase64 } from "@aws-sdk/util-base64-node";
import { Client, ClientConfig, QueryResult } from "pg";
import { isDatabaseKeyword } from "./util/pgUtil";




export interface SaveToPGResult {
    tableName: string,
    columnRenameRecords: Record<string, string>,
    numOfRecords: number
}

export default async function saveItemsToNewTable(items: { [key: string]: AttributeValue; }[]): Promise<SaveToPGResult> {

    const dbConfig: ClientConfig = {
        user: "dpp",
        database: "dpp",
        password: "dpp",
        port: 21085,
        host: "localhost"
    };

    const client = new Client(dbConfig);
    await client.connect();

    try {

        const createTableResult: CreateTableResult = await createTable(client, items);

        await insertItems(client, createTableResult.tableName, createTableResult.columnRenameRecords, items);

        const numOfRecords = await getNumOfRecordsInTable(client, createTableResult.tableName);

        return {
            tableName: createTableResult.tableName,
            columnRenameRecords: createTableResult.columnRenameRecords,
            numOfRecords: numOfRecords
        }

    } finally {
        await client.end();
    }


}

export interface CreateTableResult {
    tableName: string;
    columnRenameRecords: Record<string, string>;
}

async function createTable(client: Client, items: { [key: string]: AttributeValue; }[]): Promise<CreateTableResult> {

    const tableName = "t_" + new Date().getTime();

    const columnNames = extractColumnNames(items);

    let ddl: string = `create table ${tableName} ( \n`;

    const columnRenameRecords: Record<string, string> = { };

    const columnDefs: string = Array.from(columnNames.values())
        .map(columnName => {
            let cn = columnName;
            if (isDatabaseKeyword(columnName)) {
                const newColumnName = columnName + "_dekeyworded";
                columnRenameRecords[columnName] = newColumnName;
                cn = newColumnName;
            }
            return ` ${cn} text`;
        })
        .join(",\n");
    ddl += columnDefs + "\n";
    ddl += ")";

    console.log(`The ddl for the new table is going to be: \n ${ddl}`);
    await client.query(ddl);
    console.log(`Table ${tableName} created in Postgres`);

    return {
        tableName: tableName,
        columnRenameRecords: columnRenameRecords
    };
}


export function extractColumnNames(items: { [key: string]: AttributeValue; }[]): Set<string> {
    const columnNames = new Set<string>();
    for (const item of items) {
        Object.keys(item).forEach(k => columnNames.add(k));
    }
    return columnNames;
}

async function insertItems(client: Client, tableName: string, columnRenameRecords: Record<string, string>, items: { [key: string]: AttributeValue; }[]) {
    let savedCount = 0;
    for (const item of items) {
        const iq: InsertQuery = toInsertQuery(tableName, columnRenameRecords, item);
        await client.query(iq.sql, iq.values);
        savedCount++;
        if (savedCount % 500 === 0) {
            console.log(`Inserted ${savedCount} items`);
        }
    }
    console.log(`Inserted ${savedCount} items in total`);
}

async function getNumOfRecordsInTable(client: Client, tableName: string): Promise<number> {
    const results: QueryResult<any> = await client.query(`select count(*) from ${tableName}`);
    return results.rows[0].count;
}

export function toInsertQuery(tableName: string, columnRenameRecords: Record<string, string>, item: { [key: string]: AttributeValue; }): InsertQuery {
    const columns: string[] = [];
    const placeHolders: string[] = [];
    const values: string[] = [];

    let plIndex = 0;
    for (const [key, av] of Object.entries(item)) {
        let columnName = key;
        let newColumnName = columnRenameRecords[key];
        if (newColumnName) {
            columnName = newColumnName;
        }
        columns.push(columnName);
        placeHolders.push("$" + (++plIndex));
        values.push(attributeValueToString(av));
    }

    const plJoined = placeHolders.join(",");
    const columnsJoined = columns.join(",");
    return {
        sql: `insert into ${tableName}(${columnsJoined}) values(${plJoined})`,
        values: values
    };

}


export interface InsertQuery {
    sql: string;
    values: string[];
}

export function attributeValueJsonReplacer(key: string, value: any) {
    if (value === null || value === undefined) {
        return value;
    }

    //todo: remove this awkward enumeration
    if (
        value.hasOwnProperty('NULL') ||
        value.hasOwnProperty('N') ||
        value.hasOwnProperty('B') ||
        value.hasOwnProperty('S') ||
        value.hasOwnProperty('BOOL') ||
        value.hasOwnProperty('BS') ||
        value.hasOwnProperty('SS') ||
        value.hasOwnProperty('NS') ||
        value.hasOwnProperty('L') ||
        value.hasOwnProperty('M')
    ) {
        return attributeValueToString(value);
    }

    return value;
}

export function attributeValueToString(av: AttributeValue): string {
    const [type, value] = Object.entries(av)[0];
    if (value === null || value === undefined) {
        return null;
    }
    switch (type) {
        case 'NULL': return null;
        case 'N': return value.toString();
        case 'B': return toBase64(value);
        case 'S': return value;
        case 'BOOL': return value.toString();
        case 'BS': return JSON.stringify(value.map(b => toBase64(b)));
        case 'SS': return JSON.stringify(value);
        case 'NS': return JSON.stringify(value);
        case 'L': return JSON.stringify(value, attributeValueJsonReplacer);
        case 'M': return JSON.stringify(value, attributeValueJsonReplacer);


        default: throw "Unsupported dynamodb type: " + type;
    }

}





