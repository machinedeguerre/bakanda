import { describe, expect, it } from "bun:test";
import { parseBoolean, parseInteger } from "./config";

describe("parseBoolean", () => {
  it("should return true for truthy values", () => {
    expect(parseBoolean("1")).toBe(true);
    expect(parseBoolean("true")).toBe(true);
    expect(parseBoolean("yes")).toBe(true);
    expect(parseBoolean("on")).toBe(true);
    expect(parseBoolean("enable")).toBe(true);
    expect(parseBoolean("enabled")).toBe(true);
  });

  it("should return true for random string values", () => {
    expect(parseBoolean("random")).toBe(true);
    expect(parseBoolean("alfred was here")).toBe(true);
  });

  it("should return false for falsy values", () => {
    expect(parseBoolean("0")).toBe(false);
    expect(parseBoolean("false")).toBe(false);
    expect(parseBoolean("no")).toBe(false);
    expect(parseBoolean("off")).toBe(false);
    expect(parseBoolean("disable")).toBe(false);
    expect(parseBoolean("disabled")).toBe(false);
    expect(parseBoolean("")).toBe(false);
  });

  it("should return false for non-string values", () => {
    expect(parseBoolean(undefined)).toBe(false);
    expect(parseBoolean(null as any)).toBe(false);
    expect(parseBoolean(0 as any)).toBe(false);
    expect(parseBoolean(1 as any)).toBe(false);
    expect(parseBoolean(true as any)).toBe(false);
    expect(parseBoolean(false as any)).toBe(false);
    expect(parseBoolean({} as any)).toBe(false);
    expect(parseBoolean([] as any)).toBe(false);
  });
});

describe("parseInteger", () => {
  it("should return the default value if the input is undefined", () => {
    expect(parseInteger(undefined, 42)).toBe(42);
  });

  it("should return the parsed integer value", () => {
    expect(parseInteger("42", 0)).toBe(42);
    expect(parseInteger("0", 0)).toBe(0);
    expect(parseInteger("1", 0)).toBe(1);
    expect(parseInteger("123", 0)).toBe(123);
  });

  it("should remove whitespaces before parsing", () => {
    expect(parseInteger(" 42 ", 0)).toBe(42);
    expect(parseInteger(" 13 12 ", 0)).toBe(1312);
  });

  it("should return the default value if the input is not a number", () => {
    expect(parseInteger("random", 42)).toBe(42);
    expect(parseInteger("alfred was here", 42)).toBe(42);
  });

  it("should return the rounded value if the input has decimals", () => {
    expect(parseInteger("42.01", 0)).toBe(42);
    expect(parseInteger("42.49", 0)).toBe(42);
    expect(parseInteger("42.50", 0)).toBe(43);
    expect(parseInteger("42.99", 0)).toBe(43);
    expect(parseInteger("13.12", 0)).toBe(13);
  });
});
