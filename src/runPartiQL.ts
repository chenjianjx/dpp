
import { AttributeValue, DynamoDBClient, ExecuteStatementCommand, ExecuteStatementOutput } from "@aws-sdk/client-dynamodb";
import { fileSync } from 'tmp'
import { writeFileSync } from "fs";

/**
 * 
 * @param ql 
 * @returns the items
 */
export default async function run(ql: string): Promise<{ [key: string]: AttributeValue; }[]> {
    console.log("Running PartiQL...")

    const client = new DynamoDBClient({ });

    const items: { [key: string]: AttributeValue; }[] = [];
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

        const itemsFilename:string = fileSync({ prefix: 'dpp-items-', postfix: '.json' }).name;

        await writeFileSync(itemsFilename, JSON.stringify(items));

        console.log(`Items are saved in file ${itemsFilename} . You can use command "dpp-load" to load it to postgres without running the QL again. `);

        return items;
    } finally {
        client.destroy();
    }
}