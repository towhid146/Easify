import { CompanyProfile } from "../services/api";

interface CompanyAnalysisResultsProps {
  companyAnalysis: CompanyProfile;
}

function renderList(items: string[]) {
  if (!items.length) {
    return <p className="text-slate-500">No data extracted.</p>;
  }
  return (
    <ul className="list-disc space-y-1 pl-5 text-slate-700">
      {items.map((item, index) => (
        <li key={`${item}-${index}`}>{item}</li>
      ))}
    </ul>
  );
}

function CompanyAnalysisResults({ companyAnalysis }: CompanyAnalysisResultsProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-900">Company Analysis</h2>
      <p className="mt-1 text-slate-600">{companyAnalysis.companyName}</p>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <article className="rounded-xl bg-slate-50 p-4">
          <h3 className="font-semibold text-slate-900">Mission</h3>
          <p className="mt-2 text-slate-700">{companyAnalysis.mission || "N/A"}</p>
        </article>
        <article className="rounded-xl bg-slate-50 p-4">
          <h3 className="font-semibold text-slate-900">Vision</h3>
          <p className="mt-2 text-slate-700">{companyAnalysis.vision || "N/A"}</p>
        </article>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <article className="rounded-xl bg-slate-50 p-4">
          <h3 className="font-semibold text-slate-900">Core Values</h3>
          {renderList(companyAnalysis.coreValues)}
        </article>
        <article className="rounded-xl bg-slate-50 p-4">
          <h3 className="font-semibold text-slate-900">Service Types</h3>
          {renderList(companyAnalysis.serviceTypes)}
        </article>
      </div>
    </section>
  );
}

export default CompanyAnalysisResults;
