require("@blackprint/engine");

let window = globalThis;
test('Blackprint does exist on window', () => {
  expect(window.Blackprint).toBeDefined();
});