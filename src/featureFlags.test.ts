import { describe, expect, it, mock } from "bun:test";
import featureFlags from "./featureFlags";

let BACKANDA_FEATURES: string = "";

mock.module("./env", () => {
  return {
    default: () => ({
      BACKANDA_FEATURES,
    }),
  };
});

describe("featureFlags", () => {
  it("should return the default flags when no flags in environment", () => {
    BACKANDA_FEATURES = "";
    expect(featureFlags()).toEqual({
      og: true,
    });
  });

  it("should only return en enabled flags from env, when env exists", () => {
    BACKANDA_FEATURES = "og";
    expect(featureFlags()).toEqual({
      og: true,
    });
  });
});
