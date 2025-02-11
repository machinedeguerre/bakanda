import { describe } from "bun:test";
import config from "./config";

const features = ["og"];
type Feature = (typeof features)[number];

type FeatureFlags = {
  og: boolean;
};

const defaultFlags: FeatureFlags = {
  og: true,
};

const featureFlags = () => {
  const c = config();
  const envFlags = c.BAKANDA_FEATURES;

  if (envFlags.length === 0) {
    return defaultFlags;
  }

  return features.reduce((flags, feature) => {
    const enabled = envFlags.includes(feature);
    return { ...flags, [feature]: enabled };
  }, {} as FeatureFlags);
};

export default featureFlags;
