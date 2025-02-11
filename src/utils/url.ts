export const getFullUrl = (baseUrl: string, relativeUrl: string): string => {
  const fullUrl = new URL(relativeUrl, new URL(baseUrl));
  return fullUrl.href;
};
