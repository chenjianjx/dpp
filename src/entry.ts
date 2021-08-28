

export function execute(args: string[]) {
    let ql;
    try {
        ql = getQLFromArgs(args);
    } catch (e) {
        console.error(e);
        return;
    }

    console.log(ql);
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