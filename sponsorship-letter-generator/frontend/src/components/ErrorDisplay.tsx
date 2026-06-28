interface ErrorDisplayProps {
  error: string;
  onRetry: () => void;
}

function ErrorDisplay({ error, onRetry }: ErrorDisplayProps) {
  return (
    <section className="rounded-2xl border border-red-200 bg-red-50 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-red-700">
            Analysis Error
          </p>
          <p className="mt-2 text-red-800">{error}</p>
        </div>
        <button
          type="button"
          onClick={onRetry}
          className="rounded-lg border border-red-300 px-3 py-1.5 text-sm font-semibold text-red-700 transition hover:bg-red-100"
        >
          Try Again
        </button>
      </div>
    </section>
  );
}

export default ErrorDisplay;
