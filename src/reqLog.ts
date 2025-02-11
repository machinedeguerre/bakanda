import { randomUUID } from "crypto";
import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import env from "./env";
import { name, version } from "./appmeta";
import featureFlags from "./featureFlags";
import logger from "./logger";
import { randStr } from "./utils";

const requestId = () => {
  return `${randStr(3)}-${randStr(2)}-${randStr(5)}`;
};

const log = logger("app");
const reqLogScope = log.extend("req");

const reqLog = new Elysia({ name: "app" }).derive(
  { as: "global" },
  ({ request, set }) => {
    const reqId = requestId();
    const log = reqLogScope.extend(reqId);
    set.headers["x-request-id"] = reqId;
    log.info("Incoming request", {
      method: request.method,
      url: request.url,
    });
    return { log };
  }
);

export default reqLog;
