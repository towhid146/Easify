import SponsorshipGenerator from "./components/SponsorshipGenerator";

function App() {
  return (
    <div className="min-h-screen">
      <main className="mx-auto w-[min(1100px,94vw)] py-10">
        <header className="mb-8 rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-700">
            OpenAI-Powered Toolkit
          </p>
          <h1 className="mt-2 font-sans text-3xl font-bold leading-tight text-slate-900 md:text-4xl">
            Easify Sponsorship Studio
          </h1>
          <p className="mt-3 max-w-3xl text-slate-600">
            Analyze any company website, detect strategic overlap with your
            program, and generate a customized sponsorship letter with token
            usage transparency.
          </p>
        </header>
        <SponsorshipGenerator />
      </main>
    </div>
  );
}

export default App;
