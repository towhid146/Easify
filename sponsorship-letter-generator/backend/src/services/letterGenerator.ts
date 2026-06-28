import { CompanyProfile, OverlapAnalysis, ProgramData } from "../types";
import openaiAnalyzer from "./openaiAnalyzer";

class LetterGeneratorService {
  async generate(
    programData: ProgramData,
    companyAnalysis: CompanyProfile,
    overlapAnalysis: OverlapAnalysis
  ) {
    return openaiAnalyzer.generateLetterHTML(
      programData,
      companyAnalysis,
      overlapAnalysis
    );
  }
}

export const letterGenerator = new LetterGeneratorService();
export default letterGenerator;
