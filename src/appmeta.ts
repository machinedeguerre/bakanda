const packageJson = import("../package.json");
const { name, version } = await packageJson;

export { name, version };
