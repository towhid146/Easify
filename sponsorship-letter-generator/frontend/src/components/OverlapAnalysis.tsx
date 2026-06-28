import { OverlapAnalysis as OverlapAnalysisType } from "../services/api";

interface OverlapAnalysisProps {
  overlapAnalysis: OverlapAnalysisType;
  companyName: string;
}

function scoreClass(score: number): string {
  if (score >= 80) return "text-emerald-700";
  if (score >= 60) return "text-amber-700";
  return "text-rose-700";
}

function OverlapAnalysis({ overlapAnalysis, companyName }: OverlapAnalysisProps) {
  const breakdown = overlapAnalysis.alignmentBreakdown;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-900">Overlap Analysis</h2>
      <p className="mt-1 text-slate-600">
        Strategic fit between your program and {companyName}.
      </p>

      <div className="mt-4 rounded-xl bg-cyan-50 p-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700">
          Overall Alignment Score
        </p>
        <p className={`text-3xl font-bold ${scoreClass(overlapAnalysis.overallAlignmentScore)}`}>
          {overlapAnalysis.overallAlignmentScore}/100
        </p>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {[
          ["Mission Alignment", breakdown.missionAlignment.score, breakdown.missionAlignment.explanation],
          ["Audience Alignment", breakdown.audienceAlignment.score, breakdown.audienceAlignment.explanation],
          ["Values Alignment", breakdown.valuesAlignment.score, breakdown.valuesAlignment.explanation],
          ["Service Relevance", breakdown.serviceRelevance.score, breakdown.serviceRelevance.explanation],
          ["Industry Fit", breakdown.industryFit.score, breakdown.industryFit.explanation]
        ].map(([label, score, explanation]) => (
          <article key={label as string} className="rounded-xl bg-slate-50 p-4">
            <p className="font-semibold text-slate-900">{label}</p>
            <p className={`mt-1 text-lg font-bold ${scoreClass(score as number)}`}>
              {score as number}/100
            </p>
            <p className="mt-2 text-slate-700">{explanation as string}</p>
          </article>
        ))}
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <article className="rounded-xl bg-slate-50 p-4">
          <h3 className="font-semibold text-slate-900">Key Match Points</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
            {overlapAnalysis.keyMatchPoints.map((item, idx) => (
              <li key={`${item}-${idx}`}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="rounded-xl bg-slate-50 p-4">
          <h3 className="font-semibold text-slate-900">Sponsorship Fit</h3>
          <p className="mt-2 text-slate-700">
            <span className="font-semibold">Suitability:</span>{" "}
            {overlapAnalysis.sponsorshipFit.suitability}
          </p>
          <p className="mt-2 text-slate-700">{overlapAnalysis.sponsorshipFit.reasoning}</p>
          <p className="mt-2 text-slate-700">
            <span className="font-semibold">Suggested Approach:</span>{" "}
            {overlapAnalysis.sponsorshipFit.suggestedApproach}
          </p>
        </article>
      </div>
    </section>
  );
}

export default OverlapAnalysis;
