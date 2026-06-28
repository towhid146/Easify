import { TokenUsageData } from "../services/api";

interface TokenUsageDisplayProps {
  tokenUsage: TokenUsageData;
}

function TokenUsageDisplay({ tokenUsage }: TokenUsageDisplayProps) {
  const rows = [
    ["Company Analysis", tokenUsage.companyAnalysis.total],
    ["Overlap Analysis", tokenUsage.overlapAnalysis.total],
    ["Letter Generation", tokenUsage.letterGeneration.total]
  ];

  return (
    <section className="rounded-2xl border border-cyan-200 bg-cyan-50 p-5">
      <h2 className="text-xl font-bold text-cyan-900">Token Usage Statistics</h2>
      <div className="mt-3 overflow-hidden rounded-lg border border-cyan-100 bg-white">
        <table className="w-full text-left">
          <tbody>
            {rows.map(([label, value]) => (
              <tr key={label} className="border-b border-cyan-50 last:border-none">
                <td className="px-4 py-3 font-medium text-slate-700">{label}</td>
                <td className="px-4 py-3 font-mono text-slate-900">{value} tokens</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 space-y-1 font-mono text-slate-800">
        <p>Total: {tokenUsage.totalTokens} tokens</p>
        <p>Estimated Cost: ${tokenUsage.estimatedCost.toFixed(4)} USD</p>
      </div>
    </section>
  );
}

export default TokenUsageDisplay;
