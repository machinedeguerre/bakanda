import env from "./env";

export const parseBoolean = (value: string | undefined) => {
  if (typeof value !== "string") return false;
  const lower = value.toLowerCase().trim();
  const falseValues = new Set([
    "0",
    "false",
    "no",
    "off",
    "disable",
    "disabled",
    "",
  ]);
  return !falseValues.has(lower);
};

export const parseInteger = (
  value: string | undefined,
  defaultValue: number
) => {
  if (value === undefined) return defaultValue;
  const result = parseFloat(value.replace(/[ \t\r\n]+/g, ""));
  return isNaN(result) ? defaultValue : Math.round(result);
};

export const parseString = (
  value: string | undefined,
  defaultValue: string
) => {
  return value === undefined ? defaultValue : value;
};

export const parseArray = (
  value: string | undefined,
  defaultValue: string[]
) => {
  if (value === undefined) return defaultValue;
  return value.split(/[ ,\t\r\n]/).filter((item) => item !== "");
};

const config = () => {
  const e = env();
  return {
    BAKANDA_FEATURES: parseArray(e.BAKANDA_FEATURES, []),
    PORT: parseInteger(e.PORT, 0),
  };
};

export default config;
