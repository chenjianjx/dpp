import { AttributeValue } from "@aws-sdk/client-dynamodb";
import runPartiQL from './runPartiQL';
import saveIntoPostgres, { SaveToPGResult } from './saveIntoPostgres';
import { StopWatch } from 'stopwatch-node';


export function execute(args: string[]) {
    (async () => {
        const sw = new StopWatch('Timer');


        let ql;
        try {
            ql = getQLFromArgs(args);
        } catch (e) {
            console.error(e);
            return;
        }


        sw.start("Run PartiQL");
        console.log("Your QL is:  " + ql);
        const items: { [key: string]: AttributeValue; }[] = await runPartiQL(ql);
        console.log(items.length + " items in the QL's result");
        sw.stop();


        sw.start("Parse results and save to Postgres");
        const saveToPGResult: SaveToPGResult = await saveIntoPostgres(items);
        console.log(`\nAll the results have been saved to ${saveToPGResult.tableName} . Num of records is ${saveToPGResult.numOfRecords}`);
        sw.stop();

        sw.prettyPrint();

    })();
}


/**
 * throws string if not found
 * @param args 
 * @returns 
 */
export function getQLFromArgs(args: string[]) {
    if (!args || args.length == 0) {
        throw 'Please input a double-quoted PartiQL like "select * from ..." ';
    }

    const ql: string = args[0];

    if (ql.split(" ")[0].toLowerCase() !== "select") {
        throw 'Only "select" statements are supported';
    }

    return ql;

}

