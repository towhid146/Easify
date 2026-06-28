import { useEffect, useMemo, useState } from "react";

const steps = [
  "Extracting website content",
  "Analyzing company profile",
  "Finding overlap opportunities",
  "Generating sponsorship letter"
];

function LoadingScreen() {
  const [activeStep, setActiveStep] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveStep((prev) => (prev < steps.length ? prev + 1 : prev));
    }, 4500);

    return () => clearInterval(id);
  }, []);

  const eta = useMemo(() => Math.max(8, 26 - activeStep * 5), [activeStep]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <h2 className="text-2xl font-bold text-slate-900">Processing Your Request</h2>
      <p className="mt-1 text-slate-600">
        This usually takes about 20 to 30 seconds.
      </p>

      <div className="mx-auto mt-6 h-14 w-14 animate-spin rounded-full border-4 border-cyan-200 border-t-cyan-700" />

      <div className="mx-auto mt-6 max-w-xl space-y-3 text-left">
        {steps.map((step, index) => {
          const order = index + 1;
          const done = activeStep > order;
          const current = activeStep === order;
          return (
            <div
              key={step}
              className={`rounded-lg border px-4 py-3 ${
                done
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : current
                    ? "border-cyan-200 bg-cyan-50 text-cyan-800"
                    : "border-slate-200 bg-slate-50 text-slate-500"
              }`}
            >
              <span className="mr-2">{done ? "Done" : current ? "In progress" : "Pending"}</span>
              {step}
            </div>
          );
        })}
      </div>

      <p className="mt-5 text-sm text-slate-500">Estimated time remaining: ~{eta}s</p>
    </section>
  );
}

export default LoadingScreen;
