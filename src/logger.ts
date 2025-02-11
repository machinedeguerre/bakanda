import debug from "debug";
import { name, version } from "./appmeta";

const logLevels = ["trace", "debug", "info", "warn", "error"] as const;
type LogLevel = (typeof logLevels)[number];

const logger = (scope?: string | undefined) => {
  const s = typeof scope === "string" ? scope : `${name}`;
  const d = debug(s);
  const log = (level: LogLevel, msg: string, meta?: Record<string, string>) => {
    d(msg, { level, ...meta });
  };
  return {
    ...logLevels.reduce(
      (acc, level: LogLevel) => ({
        ...acc,
        [level]: (msg: string, meta?: Record<string, any>) => {
          log(level, msg, { ...meta });
        },
      }),
      {} as Record<LogLevel, (msg: string, meta?: Record<string, any>) => void>
    ),
    extend: (subScope: string) => {
      return logger(`${s}:${subScope}`);
    },
  };
};

export default logger;
