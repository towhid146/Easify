import { useState } from "react";
import {
  AnalysisResponse,
  ProgramData,
  analyzeSponsorship
} from "../services/api";
import ProgramInputForm from "./ProgramInputForm";
import CompanyAnalysisResults from "./CompanyAnalysisResults";
import OverlapAnalysis from "./OverlapAnalysis";
import LetterPreview from "./LetterPreview";
import LoadingScreen from "./LoadingScreen";
import ErrorDisplay from "./ErrorDisplay";
import TokenUsageDisplay from "./TokenUsageDisplay";

function SponsorshipGenerator() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AnalysisResponse["data"] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (programData: ProgramData, websiteUrl: string) => {
    setLoading(true);
    setError(null);
    setResults(null);
    setStep(2);

    try {
      const result = await analyzeSponsorship(programData, websiteUrl);
      if (!result.success || !result.data) {
        throw new Error(result.error || "Failed to generate sponsorship data.");
      }
      setResults(result.data);
      setStep(3);
    } catch (err) {
      setStep(1);
      setError(err instanceof Error ? err.message : "Unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setResults(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      {step === 1 && <ProgramInputForm onSubmit={handleAnalyze} isLoading={loading} />}
      {step === 2 && <LoadingScreen />}
      {step === 3 && results && (
        <>
          <CompanyAnalysisResults companyAnalysis={results.companyAnalysis} />
          <OverlapAnalysis
            overlapAnalysis={results.overlapAnalysis}
            companyName={results.companyAnalysis.companyName}
          />
          <LetterPreview
            letter={results.letter}
            companyName={results.companyAnalysis.companyName}
          />
          <TokenUsageDisplay tokenUsage={results.tokenUsage} />
          <button
            type="button"
            onClick={resetForm}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Analyze Another Company
          </button>
        </>
      )}
      {error && <ErrorDisplay error={error} onRetry={resetForm} />}
    </div>
  );
}

export default SponsorshipGenerator;
