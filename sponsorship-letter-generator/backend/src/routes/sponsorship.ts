import { Router } from "express";
import { validateSponsorshipRequest } from "../middleware/validation";
import websiteExtractor from "../services/websiteExtractor";
import claudeAnalyzer from "../services/claudeAnalyzer";
import letterGenerator from "../services/letterGenerator";
import { ApiResponse, AnalysisResponse, ProgramData } from "../types";

const router = Router();

function estimateUsdCost(totalTokens: number): number {
  const approxUsdPerToken = 0.000003;
  return Number((totalTokens * approxUsdPerToken).toFixed(6));
}

router.post("/analyze", validateSponsorshipRequest, async (req, res) => {
  const { programData, websiteUrl } = req.body as {
    programData: ProgramData;
    websiteUrl: string;
  };

  const extracted = await websiteExtractor.extractWebsiteContent(websiteUrl);
  const companyAnalysisResult = await claudeAnalyzer.analyzeCompanyProfile(extracted);
  const overlapAnalysisResult = await claudeAnalyzer.analyzeOverlap(
    programData,
    companyAnalysisResult.data
  );
  const letterResult = await letterGenerator.generate(
    programData,
    companyAnalysisResult.data,
    overlapAnalysisResult.data
  );

  const totalTokens =
    companyAnalysisResult.tokensUsed.total +
    overlapAnalysisResult.tokensUsed.total +
    letterResult.tokensUsed.total;

  const payload: AnalysisResponse = {
    companyAnalysis: companyAnalysisResult.data,
    overlapAnalysis: overlapAnalysisResult.data,
    letter: letterResult.data,
    tokenUsage: {
      companyAnalysis: companyAnalysisResult.tokensUsed,
      overlapAnalysis: overlapAnalysisResult.tokensUsed,
      letterGeneration: letterResult.tokensUsed,
      totalTokens,
      estimatedCost: estimateUsdCost(totalTokens)
    }
  };

  const response: ApiResponse<AnalysisResponse> = {
    success: true,
    data: payload
  };

  res.status(200).json(response);
});

export default router;
