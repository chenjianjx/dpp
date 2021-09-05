
import { getQLFromArgs, getItemsFilePathFromArgs } from '../entry'
import { fileSync as tempFileSync } from 'tmp'

test('getQLFromArgs', () => {
    expect(getQLFromArgs(["select * from foo"])).toBe("select * from foo");
    expect(getQLFromArgs(["SELECT * FROM FOO"])).toBe("SELECT * FROM FOO");

    expect(() => getQLFromArgs(undefined)).toThrow();
    expect(() => getQLFromArgs(null)).toThrow();
    expect(() => getQLFromArgs([])).toThrow();
    expect(() => getQLFromArgs(["insert into foo ..."])).toThrow();

});


test('getItemsFilePathFromArgs', () => {
    
    const file = tempFileSync().name;
    const nonExistingFile = file + ".non.existing";
     
    expect(getItemsFilePathFromArgs([file])).toBe(file);
    expect(() => getItemsFilePathFromArgs([nonExistingFile])).toThrow(); 

    expect(() => getItemsFilePathFromArgs(undefined)).toThrow();
    expect(() => getItemsFilePathFromArgs(null)).toThrow();
    expect(() => getItemsFilePathFromArgs([])).toThrow();
});