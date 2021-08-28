
import { AttributeValue, DynamoDBClient, ExecuteStatementCommand, ExecuteStatementOutput } from "@aws-sdk/client-dynamodb";

/**
 * 
 * @param ql 
 * @returns the items
 */
export default async function run(ql: string): Promise<{ [key: string]: AttributeValue; }[]> {

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
            NextToken = results.NextToken;
            if (!NextToken) {
                break;
            }
        }        
        return items;
    } finally {
        client.destroy();
    }
}