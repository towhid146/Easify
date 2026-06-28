import { CompanyProfile, OverlapAnalysis, ProgramData } from "../types";
import claudeAnalyzer from "./claudeAnalyzer";

class LetterGeneratorService {
  async generate(
    programData: ProgramData,
    companyAnalysis: CompanyProfile,
    overlapAnalysis: OverlapAnalysis
  ) {
    return claudeAnalyzer.generateLetterHTML(
      programData,
      companyAnalysis,
      overlapAnalysis
    );
  }
}

export const letterGenerator = new LetterGeneratorService();
export default letterGenerator;
