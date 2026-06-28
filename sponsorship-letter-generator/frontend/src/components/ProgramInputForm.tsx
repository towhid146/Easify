import { FormEvent, useState } from "react";
import { ProgramData, ProgramType } from "../services/api";

interface ProgramInputFormProps {
  isLoading: boolean;
  onSubmit: (programData: ProgramData, websiteUrl: string) => Promise<void>;
}

const initialForm: ProgramData = {
  name: "",
  type: "Event",
  description: "",
  goals: "",
  targetAudience: "",
  sponsorshipAsk: ""
};

function ProgramInputForm({ isLoading, onSubmit }: ProgramInputFormProps) {
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [programData, setProgramData] = useState<ProgramData>(initialForm);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit(programData, websiteUrl);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div>
        <label className="mb-1 block text-sm font-semibold text-slate-700">
          Company Website URL
        </label>
        <input
          type="url"
          required
          value={websiteUrl}
          onChange={(e) => setWebsiteUrl(e.target.value)}
          placeholder="https://company.com"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none ring-cyan-300 transition focus:ring"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">
            Program Name
          </label>
          <input
            type="text"
            required
            value={programData.name}
            onChange={(e) =>
              setProgramData((prev) => ({ ...prev, name: e.target.value }))
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none ring-cyan-300 transition focus:ring"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">
            Program Type
          </label>
          <select
            required
            value={programData.type}
            onChange={(e) =>
              setProgramData((prev) => ({
                ...prev,
                type: e.target.value as ProgramType
              }))
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none ring-cyan-300 transition focus:ring"
          >
            <option value="Event">Event</option>
            <option value="Initiative">Initiative</option>
            <option value="Campaign">Campaign</option>
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-slate-700">
          Program Description
        </label>
        <textarea
          required
          rows={4}
          value={programData.description}
          onChange={(e) =>
            setProgramData((prev) => ({ ...prev, description: e.target.value }))
          }
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none ring-cyan-300 transition focus:ring"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-slate-700">
          Program Goals
        </label>
        <textarea
          required
          rows={4}
          value={programData.goals}
          onChange={(e) =>
            setProgramData((prev) => ({ ...prev, goals: e.target.value }))
          }
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none ring-cyan-300 transition focus:ring"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">
            Target Audience (Optional)
          </label>
          <input
            type="text"
            value={programData.targetAudience}
            onChange={(e) =>
              setProgramData((prev) => ({
                ...prev,
                targetAudience: e.target.value
              }))
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none ring-cyan-300 transition focus:ring"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">
            Sponsorship Ask (Optional)
          </label>
          <input
            type="text"
            value={programData.sponsorshipAsk}
            onChange={(e) =>
              setProgramData((prev) => ({
                ...prev,
                sponsorshipAsk: e.target.value
              }))
            }
            placeholder="Funding, in-kind support, mentorship..."
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none ring-cyan-300 transition focus:ring"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-xl bg-cyan-700 px-4 py-3 font-semibold text-white transition hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? "Analyzing..." : "Analyze and Generate Letter"}
      </button>
    </form>
  );
}

export default ProgramInputForm;
