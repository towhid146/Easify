import axios from "axios";
import { CheerioAPI, load } from "cheerio";
import { ExtractedContent } from "../types";

class WebsiteExtractor {
  private readonly timeoutMs = 10000;

  async extractWebsiteContent(websiteUrl: string): Promise<ExtractedContent> {
    this.validateUrl(websiteUrl);

    try {
      const response = await axios.get<string>(websiteUrl, {
        timeout: this.timeoutMs,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8"
        }
      });

      const $ = load(response.data);
      this.removeNoise($);

      return {
        companyName: this.extractCompanyName($),
        aboutUs: this.extractSection($, ["about", "company", "who-we-are"]),
        mission: this.extractSection($, ["mission", "purpose"]),
        vision: this.extractSection($, ["vision", "future"]),
        services: this.extractSection($, ["service", "solutions", "offerings"]),
        team: this.extractSection($, ["team", "leadership", "staff"]),
        blog: this.extractLatestBlogPosts($, 3),
        recentProjects: this.extractSection($, ["project", "portfolio", "case-study"])
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === "ECONNABORTED") {
          throw new Error("Website request timed out after 10 seconds.");
        }
        if (error.response) {
          throw new Error(
            `Failed to fetch website content. HTTP ${error.response.status}.`
          );
        }
        throw new Error(`Network error while fetching website: ${error.message}`);
      }
      throw new Error("Unexpected extraction error.");
    }
  }

  cleanText(text: string): string {
    const normalized = text
      .replace(/&nbsp;|&#160;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'")
      .replace(/<[^>]*>/g, " ")
      .replace(/[^\w\s.,!?'"():;/%&-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    return normalized.slice(0, 1000);
  }

  extractLatestBlogPosts($: CheerioAPI, limit = 3): string[] {
    const posts: string[] = [];
    const candidates = $("article, [class*='blog'], [class*='post'], [id*='blog']");

    candidates.each((_, element) => {
      if (posts.length >= limit) {
        return;
      }

      const node = $(element);
      const title =
        node.find("h1, h2, h3, [class*='title']").first().text().trim() ||
        "Untitled post";
      const date = node.find("time, [class*='date']").first().text().trim();
      const rawText = node.text().replace(title, "");
      const words = this.cleanText(rawText).split(" ").slice(0, 200).join(" ");
      const preview = words.length > 0 ? words : "No excerpt available.";
      const entry = date ? `${title} (${date}): ${preview}` : `${title}: ${preview}`;
      posts.push(entry.slice(0, 1000));
    });

    return posts.slice(0, limit);
  }

  extractCompanyName($: CheerioAPI): string {
    const h1 = $("h1").first().text().trim();
    if (h1) {
      return this.cleanText(h1);
    }

    const logoAlt =
      $("img[alt*='logo'], img[class*='logo']").first().attr("alt")?.trim() ?? "";
    if (logoAlt) {
      return this.cleanText(logoAlt.replace(/logo/i, "").trim());
    }

    const title = $("title").first().text().trim();
    if (title) {
      const compact = title.split("|")[0].split("-")[0].trim();
      return this.cleanText(compact);
    }

    return "Unknown Company";
  }

  extractSection($: CheerioAPI, keywords: string[]): string {
    const parts: string[] = [];

    for (const keyword of keywords) {
      const byId = $(`[id*="${keyword}"]`).text();
      const byClass = $(`[class*="${keyword}"]`).text();
      const byAria = $(`[aria-label*="${keyword}"]`).text();
      const merged = `${byId} ${byClass} ${byAria}`.trim();
      if (merged) {
        parts.push(merged);
      }
    }

    if (parts.length === 0) {
      return "";
    }

    return this.cleanText(parts.join(" "));
  }

  private removeNoise($: CheerioAPI): void {
    $(
      "script, style, nav, footer, noscript, iframe, [class*='ads'], [id*='ads'], [class*='cookie'], [id*='cookie']"
    ).remove();
  }

  private validateUrl(url: string): void {
    try {
      const parsed = new URL(url);
      if (!["http:", "https:"].includes(parsed.protocol)) {
        throw new Error("Invalid protocol");
      }
    } catch {
      throw new Error("Invalid URL provided.");
    }
  }
}

export const websiteExtractor = new WebsiteExtractor();
export default websiteExtractor;
