import { isDatabaseKeyword } from '../pgUtil';
test("isDatabaseKeyword", () => {
    expect(isDatabaseKeyword("primary")).toBeTruthy();
    expect(isDatabaseKeyword("PRIMARY")).toBeTruthy();
    expect(isDatabaseKeyword("comment")).toBeFalsy();
});