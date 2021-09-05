
import { AttributeValue, DynamoDBClient, ExecuteStatementCommand, ExecuteStatementOutput } from "@aws-sdk/client-dynamodb";
import { fileSync as tempFileSync } from 'tmp'
import { writeFileSync } from "fs";
import { itemsToJson } from "./ItemsJsonConverter";

/**
 * 
 * @param ql 
 * @returns the items
 */
export default async function run(ql: string): Promise<{ [key: string]: AttributeValue; }[]> {
    console.log("Running PartiQL...")

    const client = new DynamoDBClient({ });

    let items: { [key: string]: AttributeValue; }[] = [];
    let NextToken;

    try {

        while (true) {

            const command = new ExecuteStatementCommand({
                Statement: ql,
                NextToken: NextToken
            });
            const results: ExecuteStatementOutput = await client.send(command);
            //console.log(`NextToken will be ` + results.NextToken);
            items.push(...results.Items);
            console.log(`Fetched ${items.length} records up to now`);
            NextToken = results.NextToken;
            if (!NextToken) {
                break;
            }
        }
        console.log(`Fetched ${items.length} records in total `);

        const itemsFilename:string = tempFileSync({ prefix: 'dpp-items-', postfix: '.json' }).name;

        await writeFileSync(itemsFilename, itemsToJson(items), {encoding: 'utf8'});

        console.log(`Items are saved in file ${itemsFilename} . You can use command "dpp-load" to manually load it to a postgres table. `);

        return items;
    } finally {
        client.destroy();
    }
}

