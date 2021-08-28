
import { getQLFromArgs } from '../entry'

test('getQLFromArgs', () => {
    expect(getQLFromArgs(["select * from foo"])).toBe("select * from foo");
    expect(getQLFromArgs(["SELECT * FROM FOO"])).toBe("SELECT * FROM FOO");

    expect(() => getQLFromArgs(undefined)).toThrow();
    expect(() => getQLFromArgs(null)).toThrow();
    expect(() => getQLFromArgs([])).toThrow();
    expect(() => getQLFromArgs(["insert into foo ..."])).toThrow();

});