export type ProgramType = "Event" | "Initiative" | "Campaign";

export interface ProgramData {
  name: string;
  type: ProgramType;
  description: string;
  goals: string;
  targetAudience?: string;
  sponsorshipAsk?: string;
}

export interface CompanyProfile {
  companyName: string;
  mission: string;
  vision: string;
  targetAudience: string[];
  serviceTypes: string[];
  coreValues: string[];
  industryFocus: string;
  workApproach: string;
  socialImpact: string;
  businessModel: string;
  keyStrengths: string[];
  partnerships: string[];
  recentProjects: string[];
}

export interface OverlapAnalysis {
  overallAlignmentScore: number;
  alignmentBreakdown: {
    missionAlignment: { score: number; explanation: string; commonGround: string };
    audienceAlignment: { score: number; explanation: string; commonGroups: string[] };
    valuesAlignment: { score: number; explanation: string; sharedValues: string[] };
    serviceRelevance: {
      score: number;
      explanation: string;
      relevantServices: string[];
    };
    industryFit: { score: number; explanation: string };
  };
  keyMatchPoints: string[];
  mutualBenefits: {
    forCompany: string[];
    forProgram: string[];
  };
  sponsorshipFit: {
    suitability: string;
    reasoning: string;
    suggestedApproach: string;
  };
  potentialConcerns: string[];
  recommendations: string[];
}

export interface TokenUsageData {
  companyAnalysis: { input: number; output: number; total: number };
  overlapAnalysis: { input: number; output: number; total: number };
  letterGeneration: { input: number; output: number; total: number };
  totalTokens: number;
  estimatedCost: number;
}

export interface AnalysisResponse {
  success: boolean;
  data: {
    companyAnalysis: CompanyProfile;
    overlapAnalysis: OverlapAnalysis;
    letter: string;
    tokenUsage: TokenUsageData;
  };
  error?: string;
}

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).trim();

async function fetchWithTimeout(
  input: RequestInfo | URL,
  init: RequestInit,
  timeoutMs = 30000
) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function analyzeSponsorship(
  programData: ProgramData,
  websiteUrl: string
): Promise<AnalysisResponse> {
  try {
    if (import.meta.env.DEV) {
      console.log("Sending sponsorship analysis request", {
        endpoint: `${API_BASE_URL}/sponsorship/analyze`,
        websiteUrl
      });
    }

    const response = await fetchWithTimeout(
      `${API_BASE_URL}/sponsorship/analyze`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ programData, websiteUrl })
      },
      30000
    );

    if (!response.ok) {
      let message = "Analysis failed";
      try {
        const errorPayload = (await response.json()) as { error?: string };
        message = errorPayload.error || message;
      } catch {
        // Keep fallback message.
      }
      throw new Error(message);
    }

    return (await response.json()) as AnalysisResponse;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("Request timed out. Please try again.");
    }
    if (error instanceof TypeError) {
      throw new Error("Network error. Please check backend connectivity.");
    }
    throw error;
  }
}
