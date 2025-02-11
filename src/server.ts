import reqLog from "./reqLog";
import { name, version } from "./appmeta";
import Elysia from "elysia";
import cors from "@elysiajs/cors";
import ogPlugin from "./og";
import featureFlags from "./featureFlags";
import config from "./config";

const server = () => {
  const app = new Elysia({ name: "server" })
    .use(cors())
    .use(reqLog)
    .get("/", ({ error, log }) => {
      return error(418, "I am a teapot");
    })
    .get("/api/version", () => ({
      name,
      version,
      features: (() => {
        const flags = featureFlags();
        return Object.keys(flags).filter(
          (key) => flags[key as keyof typeof flags]
        );
      })(),
    }));

  if (featureFlags().og) app.use(ogPlugin());

  app.listen(config().PORT);
};

export { server };
