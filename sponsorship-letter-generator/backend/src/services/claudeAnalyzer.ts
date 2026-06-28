import Anthropic from "@anthropic-ai/sdk";
import {
  AnalysisResult,
  CompanyProfile,
  ExtractedContent,
  OverlapAnalysis,
  ProgramData
} from "../types";

class ClaudeAnalyzer {
  private client: Anthropic | null;
  private model: string;

  constructor() {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    this.client = apiKey ? new Anthropic({ apiKey }) : null;
    this.model = process.env.CLAUDE_MODEL || "claude-opus-4-6";
  }

  async analyzeCompanyProfile(
    webContent: ExtractedContent
  ): Promise<AnalysisResult<CompanyProfile>> {
    this.ensureClient();

    const companyData = JSON.stringify({
      companyName: webContent.companyName,
      aboutUs: webContent.aboutUs.substring(0, 500),
      mission: webContent.mission.substring(0, 300),
      vision: webContent.vision.substring(0, 300),
      services: webContent.services.substring(0, 400),
      team: webContent.team.substring(0, 200),
      recentProjects: webContent.recentProjects.substring(0, 300)
    });

    const system =
      "You are an expert business analyst. Analyze company content and extract structured business intelligence. Be precise and concise. Respond ONLY with valid JSON, no markdown, no extra text.";
    const user = `Analyze this company information and extract a structured profile.
Respond ONLY with valid JSON.

COMPANY DATA:
${companyData}

Return ONLY this JSON structure:
{
  "companyName": "string",
  "mission": "string (max 100 words)",
  "vision": "string (max 100 words)",
  "targetAudience": ["string"],
  "serviceTypes": ["string"],
  "coreValues": ["string"],
  "industryFocus": "string",
  "workApproach": "string",
  "socialImpact": "string",
  "businessModel": "string",
  "keyStrengths": ["string"],
  "partnerships": ["string"],
  "recentProjects": ["string"]
}`;

    const response = await this.client!.messages.create({
      model: this.model,
      max_tokens: 1000,
      system,
      messages: [{ role: "user", content: user }]
    });

    const text = this.extractText(response);
    const parsed = this.parseJson<CompanyProfile>(text);

    return {
      success: true,
      data: {
        companyName: parsed.companyName || webContent.companyName || "Unknown Company",
        mission: parsed.mission || "",
        vision: parsed.vision || "",
        targetAudience: parsed.targetAudience || [],
        serviceTypes: parsed.serviceTypes || [],
        coreValues: parsed.coreValues || [],
        industryFocus: parsed.industryFocus || "",
        workApproach: parsed.workApproach || "",
        socialImpact: parsed.socialImpact || "",
        businessModel: parsed.businessModel || "",
        keyStrengths: parsed.keyStrengths || [],
        partnerships: parsed.partnerships || [],
        recentProjects: parsed.recentProjects || []
      },
      tokensUsed: this.extractTokenUsage(response)
    };
  }

  async analyzeOverlap(
    programData: ProgramData,
    companyAnalysis: CompanyProfile
  ): Promise<AnalysisResult<OverlapAnalysis>> {
    this.ensureClient();

    const input = {
      program: {
        name: programData.name,
        type: programData.type,
        description: programData.description.substring(0, 300),
        goals: programData.goals.substring(0, 300),
        targetAudience: programData.targetAudience || ""
      },
      company: companyAnalysis
    };

    const system =
      "You are a strategic consultant specializing in partnership analysis. Identify alignment between a program and company. Respond ONLY with valid JSON.";
    const user = `Analyze alignment between this program and company. Return ONLY valid JSON.

PROGRAM DATA:
${JSON.stringify(input.program)}

COMPANY PROFILE:
${JSON.stringify(input.company)}

Return ONLY this JSON:
{
  "overallAlignmentScore": 0,
  "alignmentBreakdown": {
    "missionAlignment": {
      "score": 0,
      "explanation": "string",
      "commonGround": "string"
    },
    "audienceAlignment": {
      "score": 0,
      "explanation": "string",
      "commonGroups": ["string"]
    },
    "valuesAlignment": {
      "score": 0,
      "explanation": "string",
      "sharedValues": ["string"]
    },
    "serviceRelevance": {
      "score": 0,
      "explanation": "string",
      "relevantServices": ["string"]
    },
    "industryFit": {
      "score": 0,
      "explanation": "string"
    }
  },
  "keyMatchPoints": [
    "string (specific overlap #1)",
    "string (specific overlap #2)",
    "string (specific overlap #3)"
  ],
  "mutualBenefits": {
    "forCompany": ["string"],
    "forProgram": ["string"]
  },
  "sponsorshipFit": {
    "suitability": "Good",
    "reasoning": "string",
    "suggestedApproach": "string"
  },
  "potentialConcerns": ["string"],
  "recommendations": ["string"]
}`;

    const response = await this.client!.messages.create({
      model: this.model,
      max_tokens: 1500,
      system,
      messages: [{ role: "user", content: user }]
    });

    const text = this.extractText(response);
    const parsed = this.parseJson<OverlapAnalysis>(text);
    this.validateScores(parsed);

    return {
      success: true,
      data: parsed,
      tokensUsed: this.extractTokenUsage(response)
    };
  }

  async generateLetterHTML(
    programData: ProgramData,
    companyAnalysis: CompanyProfile,
    overlapAnalysis: OverlapAnalysis
  ): Promise<AnalysisResult<string>> {
    this.ensureClient();

    const letterPrompt = `
PROGRAM:
Name: ${programData.name}
Type: ${programData.type}
Description: ${programData.description}
Goals: ${programData.goals}

COMPANY:
Name: ${companyAnalysis.companyName}
Mission: ${companyAnalysis.mission}
Values: ${companyAnalysis.coreValues.join(", ")}

KEY ALIGNMENTS:
${overlapAnalysis.keyMatchPoints.map((point, index) => `${index + 1}. ${point}`).join("\n")}

MUTUAL BENEFITS:
For Company: ${overlapAnalysis.mutualBenefits.forCompany.join("; ")}
For Program: ${overlapAnalysis.mutualBenefits.forProgram.join("; ")}
`.trim();

    const system =
      "You are an expert grant writer. Generate compelling, customized sponsorship letters that emphasize alignment and mutual benefit. Output ONLY HTML formatted text, no markdown, no backticks, no extra text.";
    const user = `Generate a professional sponsorship letter.

${letterPrompt}

Letter Requirements:
1. Address ${companyAnalysis.companyName} personally
2. Open with compelling hook (1-2 sentences)
3. Introduce program briefly (2-3 sentences)
4. Emphasize 3 specific overlaps with their mission/values (2-3 sentences each)
5. Explain mutual benefits clearly (2 sentences)
6. Include specific ask (sponsorship types/amount if available)
7. Call to action with meeting request
8. Professional and warm tone
9. Keep under 600 words

Output only valid HTML.`;

    const response = await this.client!.messages.create({
      model: this.model,
      max_tokens: 2000,
      system,
      messages: [{ role: "user", content: user }]
    });

    const html = this.extractText(response).trim();

    return {
      success: true,
      data: html,
      tokensUsed: this.extractTokenUsage(response)
    };
  }

  private ensureClient(): void {
    if (!this.client) {
      throw new Error("ANTHROPIC_API_KEY is missing. Add it to backend/.env.");
    }
  }

  private extractText(response: Anthropic.Messages.Message): string {
    const blocks = response.content ?? [];
    const firstText = blocks.find((part) => part.type === "text");
    if (!firstText || !("text" in firstText)) {
      throw new Error("Claude returned no text output.");
    }
    return firstText.text ?? "";
  }

  private parseJson<T>(raw: string): T {
    const cleaned = raw
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    try {
      return JSON.parse(cleaned) as T;
    } catch {
      const start = cleaned.indexOf("{");
      const end = cleaned.lastIndexOf("}");
      if (start !== -1 && end !== -1 && end > start) {
        return JSON.parse(cleaned.slice(start, end + 1)) as T;
      }
      throw new Error("Failed to parse Claude JSON response.");
    }
  }

  private validateScores(overlap: OverlapAnalysis): void {
    const scores = [
      overlap.overallAlignmentScore,
      overlap.alignmentBreakdown.missionAlignment.score,
      overlap.alignmentBreakdown.audienceAlignment.score,
      overlap.alignmentBreakdown.valuesAlignment.score,
      overlap.alignmentBreakdown.serviceRelevance.score,
      overlap.alignmentBreakdown.industryFit.score
    ];

    for (const score of scores) {
      if (typeof score !== "number" || score < 0 || score > 100) {
        throw new Error("Overlap score is out of range. Expected 0-100.");
      }
    }
  }

  private extractTokenUsage(response: Anthropic.Messages.Message): {
    input: number;
    output: number;
    total: number;
  } {
    const input = response.usage?.input_tokens ?? 0;
    const output = response.usage?.output_tokens ?? 0;
    return { input, output, total: input + output };
  }
}

export const claudeAnalyzer = new ClaudeAnalyzer();
export default claudeAnalyzer;
