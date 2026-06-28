export enum ProgramType {
  Event = "Event",
  Initiative = "Initiative",
  Campaign = "Campaign"
}

export interface ProgramData {
  name: string;
  type: ProgramType;
  description: string;
  goals: string;
  targetAudience?: string;
  sponsorshipAsk?: string;
}

export interface ExtractedContent {
  companyName: string;
  aboutUs: string;
  mission: string;
  vision: string;
  services: string;
  team: string;
  blog: string[];
  recentProjects: string;
}

export interface ExtractionResult {
  success: boolean;
  data?: ExtractedContent;
  error?: string;
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

export interface CompanyAnalysis {
  profile: CompanyProfile;
  summary: string;
}

export interface AlignmentScore {
  score: number;
  explanation: string;
}

export interface MissionAlignment extends AlignmentScore {
  commonGround: string;
}

export interface AudienceAlignment extends AlignmentScore {
  commonGroups: string[];
}

export interface ValuesAlignment extends AlignmentScore {
  sharedValues: string[];
}

export interface ServiceRelevance extends AlignmentScore {
  relevantServices: string[];
}

export interface IndustryFit extends AlignmentScore {}

export interface AlignmentBreakdown {
  missionAlignment: MissionAlignment;
  audienceAlignment: AudienceAlignment;
  valuesAlignment: ValuesAlignment;
  serviceRelevance: ServiceRelevance;
  industryFit: IndustryFit;
}

export interface MutualBenefits {
  forCompany: string[];
  forProgram: string[];
}

export interface SponsorshipFit {
  suitability: "Excellent" | "Good" | "Moderate" | "Poor";
  reasoning: string;
  suggestedApproach: string;
}

export interface OverlapAnalysis {
  overallAlignmentScore: number;
  alignmentBreakdown: AlignmentBreakdown;
  keyMatchPoints: string[];
  mutualBenefits: MutualBenefits;
  sponsorshipFit: SponsorshipFit;
  potentialConcerns: string[];
  recommendations: string[];
}

export interface LetterRequest {
  programData: ProgramData;
  companyAnalysis: CompanyProfile;
  overlapAnalysis: OverlapAnalysis;
}

export interface LetterResponse {
  html: string;
  text: string;
}

export interface TokenUsage {
  input: number;
  output: number;
  total: number;
}

export interface StepTokenUsage {
  companyAnalysis: TokenUsage;
  overlapAnalysis: TokenUsage;
  letterGeneration: TokenUsage;
  totalTokens: number;
  estimatedCost: number;
}

export interface AnalysisResponse {
  companyAnalysis: CompanyProfile;
  overlapAnalysis: OverlapAnalysis;
  letter: string;
  tokenUsage: StepTokenUsage;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ErrorResponse {
  success: false;
  error: string;
  details?: unknown;
}

export interface OpenAIMessage {
  role: "user" | "assistant";
  content: string;
}

export interface OpenAIResponse {
  id: string;
  type: string;
  role: "assistant";
  model: string;
  content: Array<{ type: string; text?: string }>;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

export interface AnalysisResult<T> {
  success: boolean;
  data: T;
  tokensUsed: TokenUsage;
}
