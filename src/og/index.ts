import Elysia from "elysia";
import reqLog from "../reqLog";
import { lookupDomain } from "../utils/dns";
import ogs from "open-graph-scraper";
import { isPublicIP } from "../utils/ip";
import * as cheerio from "cheerio";
import { memoize } from "../memoize";
import { mutex } from "../mutex";
import { getFullUrl } from "../utils/url";

const cache = new Map<string, object>();

const ogMutex = mutex();

const ogPlugin = () =>
  new Elysia({ name: "og" })
    .use(reqLog)
    .get("/api/og", async ({ log, query, error }) => {
      const { url } = query;

      if (!url) {
        log.debug("Missing URL query parameter");
        return error(400, "Bad Request");
      }

      if (cache.has(url)) {
        return cache.get(url);
      }

      const urlObj = (() => {
        try {
          return new URL(url);
        } catch (err: unknown) {
          log.debug("Invalid URL", { error: err as Error });
          return null;
        }
      })();
      if (urlObj === null) {
        return error(400, "Invalid URL");
      }

      if (urlObj.protocol !== "http:" && urlObj.protocol !== "https:") {
        log.debug("Invalid URL protocol", { url });
        return error(400, "Bad Request");
      }

      // This mutex is used to prevent multiple simultaneous requests.
      // Very simple implementation to avoid being used for ddos.
      // It has potential for improvement.
      const release = await ogMutex.lock();

      try {
        const ip = await lookupDomain(urlObj.hostname);
        if (ip.length === 0) {
          log.debug("Could not resolve IP from domain", { url });
          return error(400, "Bad Request");
        }

        if (!isPublicIP(ip[0])) {
          log.debug("IP is not public", { url, ip: ip[0] });
          return error(400, "Bad Request");
        }

        const data = await ogs({ url });
        const { error: err, html, result, response } = data;
        if (err) {
          log.error("Error fetching OG data");
          return error(500, "Internal Server Error");
        }
        if (result.success !== true) {
          log.error("Error fetching OG data", { result });
          return error(500, "Internal Server Error");
        }

        const ch = memoize(() => cheerio.load(html));

        const title = (() => {
          if (result.ogTitle) {
            return result.ogTitle;
          }
          if (result.twitterTitle) {
            return result.twitterTitle;
          }

          const $ = ch();
          const metaTitle = $("title").text().trim();
          if (metaTitle) {
            return metaTitle;
          }

          return url;
        })();

        const description = (() => {
          if (result.ogDescription) {
            return result.ogDescription;
          }
          if (result.twitterDescription) {
            return result.twitterDescription;
          }

          const $ = ch();
          const metaDescription =
            $('meta[name="description"]').attr("content") || "";
          if (metaDescription) {
            return metaDescription;
          }

          return url;
        })();

        const image = (() => {
          if (result.ogImage) {
            return result.ogImage[0].url;
          }
          if (result.twitterImage) {
            return result.twitterImage[0].url;
          }

          const $ = ch();
          const firstImage = $("img").attr("src") || "";
          if (firstImage) {
            return firstImage;
          }

          return null;
        })();

        if (!image) {
          cache.set(url, { title, description, image: null });
          return { title, description, image: null };
        }

        log.debug("Fetching image", { url, image });
        const imageResponse = await fetch(getFullUrl(url, image));

        if (!imageResponse.ok) {
          cache.set(url, { title, description, image: null });
          return { title, description, image: null };
        }

        const mime = imageResponse.headers.get("content-type") || "image/jpeg";
        const fileBuffer = await imageResponse.arrayBuffer();

        log.debug("Uploading image", { url, mime });
        const res = await fetch("https://2d.uix.se/upload", {
          method: "PUT",
          headers: {
            "Content-Type": mime,
          },
          body: fileBuffer,
        });

        if (!res.ok) {
          log.error("Error uploading image", { status: res.status });
          return null;
        }

        const { sha256 } = await res.json();

        cache.set(url, { title, description, image: sha256 });
        return { title, description, image: sha256 };
      } finally {
        release();
      }
    });

export default ogPlugin;
