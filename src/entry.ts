import runPartiQL from './runPartiQL';


export function execute(args: string[]) {
    (async () => {
        let ql;
        try {
            ql = getQLFromArgs(args);
        } catch (e) {
            console.error(e);
            return;
        }

        console.log("Your QL is:  " + ql);
        const items = await runPartiQL(ql);
        console.log(items.length + " items in the QL's result");
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

