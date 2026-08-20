import packageJson from "../../package.json";

it("prepares an external cache before starting Next development mode", () => {
  expect(packageJson.scripts.dev).toBe("node scripts/prepare-dev-cache.mjs && next dev");
});
