import { Lang, Slot } from "./store";

export type AISettings = {
  endpoint: string;
  model: string;
};

export type AIMode = "tasks" | "chat";

export type AIRequestInput = {
  settings: AISettings;
  mode: AIMode;
  prompt: string;
  language: Lang;
  date: string;
  existingTasks: string[];
};

export type AIRequestBody = {
  model: string;
  mode: AIMode;
  prompt: string;
  language: Lang;
  date: string;
  existingTasks: string[];
  instructions: string;
};

export type ParsedAITask = {
  title: string;
  slot?: Slot;
  asTemplate?: boolean;
  goalType?: "financial" | "weight" | "savings";
  goalTarget?: number;
  checkEveryDays?: number;
};

export type AIResponse = {
  answer?: string;
  tasks?: ParsedAITask[];
};

type RawAITask = {
  title?: unknown;
  slot?: unknown;
  asTemplate?: unknown;
  goalType?: unknown;
  goalTarget?: unknown;
  checkEveryDays?: unknown;
};

export function buildAIRequest(input: AIRequestInput): {
  endpoint: string;
  body: AIRequestBody;
} {
  return {
    endpoint: input.settings.endpoint.trim(),
    body: {
      model: input.settings.model.trim(),
      mode: input.mode,
      prompt: input.prompt.trim(),
      language: input.language,
      date: input.date,
      existingTasks: input.existingTasks,
      instructions:
        input.mode === "tasks"
          ? "Return concise JSON with tasks. Each task may include title, slot morning/afternoon/evening, asTemplate, goalType financial/weight, goalTarget, checkEveryDays."
          : "Answer as a concise productivity assistant for Sprout Planner.",
    },
  };
}

export async function requestCloudAI(
  input: AIRequestInput,
  fetcher: typeof fetch = fetch,
): Promise<AIResponse> {
  const request = buildAIRequest(input);
  if (!request.endpoint) {
    throw new Error("AI endpoint is not configured.");
  }
  const response = await fetcher(request.endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request.body),
  });
  if (!response.ok) {
    throw new Error(`AI request failed (${response.status})`);
  }
  const data = (await response.json()) as unknown;
  return {
    answer: parseAIAnswer(data),
    tasks: parseAITasks(data),
  };
}

export function parseAIAnswer(data: unknown): string {
  if (!data || typeof data !== "object") return "";
  const record = data as Record<string, unknown>;
  return typeof record.answer === "string" ? record.answer.trim() : "";
}

/* ──────────────────────────────────────────────────────────────────────────
 * Google Gemini — free cloud AI used by the hero "Plan my day" assistant.
 * The key lives in .env (VITE_GEMINI_API_KEY) and is bundled into the client,
 * so use a restricted personal/free key. See .env.example for details.
 * ──────────────────────────────────────────────────────────────────────── */

export type GeminiConfig = { apiKey: string; model: string };

/** Latest stable default + ordered fallbacks tried on quota/overload errors. */
export const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash";
const FALLBACK_MODELS = [
  "gemini-2.5-flash",
  "gemini-3.1-flash-lite",
  "gemini-2.0-flash",
];

export function getGeminiConfig(): GeminiConfig {
  const env = import.meta.env as Record<string, string | undefined>;
  const model = (env.VITE_GEMINI_MODEL ?? "").trim();
  return {
    apiKey: (env.VITE_GEMINI_API_KEY ?? "").trim(),
    model: model || DEFAULT_GEMINI_MODEL,
  };
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export type PlanRequest = {
  goal: string;
  language: Lang;
  date: string;
  existingTasks: string[];
};

const PLANNER_SYSTEM = [
  "You are the planning assistant for Sprout Planner, a friendly daily task app.",
  "Turn the user's goal into a short, realistic plan of concrete tasks for one day.",
  "Rules:",
  "- Return 3 to 6 tasks. Each title is a short, actionable phrase (max ~8 words).",
  "- Never repeat a task that is already planned for today.",
  "- Set slot to morning, afternoon, or evening only when timing matters; otherwise omit it.",
  "- Write every task title in the user's UI language.",
].join("\n");

const TASK_ITEM_SCHEMA = {
  type: "OBJECT",
  properties: {
    title: { type: "STRING" },
    slot: { type: "STRING", enum: ["morning", "afternoon", "evening"] },
  },
  required: ["title"],
} as const;

/**
 * POST a generateContent body to Gemini and return the parsed JSON payload.
 * Tries the configured model first, then falls back to other flash models.
 * Free-tier quotas are per-model, so a 429 on one model often clears on the
 * next; 503 (overloaded) is transient, so we retry the same model once.
 */
async function callGemini(
  body: object,
  config: GeminiConfig,
  fetcher: typeof fetch,
): Promise<unknown> {
  if (!config.apiKey) {
    throw new Error("Missing Gemini API key.");
  }
  const models = [
    config.model,
    ...FALLBACK_MODELS.filter((m) => m !== config.model),
  ];
  let lastStatus = 0;
  for (const model of models) {
    for (let attempt = 0; attempt < 2; attempt++) {
      const url =
        `https://generativelanguage.googleapis.com/v1beta/models/` +
        `${encodeURIComponent(model)}:generateContent?key=` +
        `${encodeURIComponent(config.apiKey)}`;
      const response = await fetcher(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (response.ok) {
        return parseGeminiJson((await response.json()) as unknown);
      }
      lastStatus = response.status;
      if (response.status === 503 && attempt === 0) {
        await sleep(700); // overloaded — quick retry on the same model
        continue;
      }
      break; // 429 / other — move on to the next fallback model
    }
  }
  throw new Error(geminiErrorMessage(lastStatus));
}

export async function requestGeminiTasks(
  req: PlanRequest,
  config: GeminiConfig = getGeminiConfig(),
  fetcher: typeof fetch = fetch,
): Promise<ParsedAITask[]> {
  const userText = [
    `UI language: ${req.language}`,
    `Date: ${req.date}`,
    req.existingTasks.length
      ? `Already planned today: ${req.existingTasks.join(", ")}`
      : "No tasks planned yet today.",
    `Goal: ${req.goal.trim()}`,
  ].join("\n");
  const body = {
    systemInstruction: { parts: [{ text: PLANNER_SYSTEM }] },
    contents: [{ role: "user", parts: [{ text: userText }] }],
    generationConfig: {
      temperature: 0.7,
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: { tasks: { type: "ARRAY", items: TASK_ITEM_SCHEMA } },
        required: ["tasks"],
      },
    },
  };
  return parseAITasks(await callGemini(body, config, fetcher));
}

/* ── Monthly roadmap — a progressive, month-by-month plan ──────────────── */

export type MonthlyPlanMonth = { focus: string; tasks: ParsedAITask[] };
export type MonthlyPlan = { overview: string; months: MonthlyPlanMonth[] };

export type MonthlyPlanRequest = {
  goal: string;
  months: number;
  language: Lang;
  date: string;
};

const ROADMAP_SYSTEM = [
  "You are the planning coach for Sprout Planner, a friendly habit & task app.",
  "Design a progressive, month-by-month roadmap that reaches the user's goal.",
  "Rules:",
  "- Return EXACTLY the requested number of months, in order (month 1 = now).",
  "- Each month has a short 'focus' (max ~10 words) and 3 to 5 recurring daily tasks.",
  "- Make the plan escalate sensibly over time (easier early, harder later).",
  "- Task titles are short, actionable phrases (max ~8 words).",
  "- Set slot to morning/afternoon/evening only when timing matters; otherwise omit.",
  "- 'overview' is one encouraging sentence summarizing the journey.",
  "- Write all text in the user's UI language.",
].join("\n");

export async function requestGeminiMonthlyPlan(
  req: MonthlyPlanRequest,
  config: GeminiConfig = getGeminiConfig(),
  fetcher: typeof fetch = fetch,
): Promise<MonthlyPlan> {
  const months = Math.min(12, Math.max(1, Math.round(req.months)));
  const userText = [
    `UI language: ${req.language}`,
    `Start date: ${req.date}`,
    `Number of months: ${months}`,
    `Goal: ${req.goal.trim()}`,
  ].join("\n");
  const body = {
    systemInstruction: { parts: [{ text: ROADMAP_SYSTEM }] },
    contents: [{ role: "user", parts: [{ text: userText }] }],
    generationConfig: {
      temperature: 0.8,
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          overview: { type: "STRING" },
          months: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                focus: { type: "STRING" },
                tasks: { type: "ARRAY", items: TASK_ITEM_SCHEMA },
              },
              required: ["focus", "tasks"],
            },
          },
        },
        required: ["overview", "months"],
      },
    },
  };
  const plan = parseMonthlyPlan(await callGemini(body, config, fetcher));
  return { ...plan, months: plan.months.slice(0, months) };
}

export function parseMonthlyPlan(data: unknown): MonthlyPlan {
  if (!data || typeof data !== "object") return { overview: "", months: [] };
  const rec = data as Record<string, unknown>;
  const overview = typeof rec.overview === "string" ? rec.overview.trim() : "";
  const rawMonths = Array.isArray(rec.months) ? rec.months : [];
  const months: MonthlyPlanMonth[] = [];
  for (const m of rawMonths) {
    if (!m || typeof m !== "object") continue;
    const mr = m as Record<string, unknown>;
    const focus = typeof mr.focus === "string" ? mr.focus.trim() : "";
    const tasks = parseAITasks({ tasks: mr.tasks });
    if (focus || tasks.length) months.push({ focus, tasks });
  }
  return { overview, months };
}

function geminiErrorMessage(status: number): string {
  if (status === 429) {
    return "AI is rate limited right now (429). Please try again in a minute.";
  }
  if (status === 503) {
    return "AI is busy right now (503). Please try again in a moment.";
  }
  return `AI request failed (${status}).`;
}

/** Extract and parse the JSON text Gemini returns in its first candidate. */
export function parseGeminiJson(data: unknown): unknown {
  if (!data || typeof data !== "object") return {};
  const candidates = (data as Record<string, unknown>).candidates;
  if (!Array.isArray(candidates) || candidates.length === 0) return {};
  const content = (candidates[0] as Record<string, unknown>)?.content;
  const parts =
    content && typeof content === "object"
      ? (content as Record<string, unknown>).parts
      : undefined;
  if (!Array.isArray(parts)) return {};
  const text = parts
    .map((part) =>
      part && typeof part === "object"
        ? String((part as Record<string, unknown>).text ?? "")
        : "",
    )
    .join("");
  if (!text.trim()) return {};
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

export function parseAITasks(data: unknown): ParsedAITask[] {
  if (!data || typeof data !== "object") return [];
  const raw = (data as Record<string, unknown>).tasks;
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const tasks: ParsedAITask[] = [];
  for (const item of raw as RawAITask[]) {
    const title =
      typeof item.title === "string" ? item.title.trim().replace(/\s+/g, " ") : "";
    const key = title.toLocaleLowerCase();
    if (!title || seen.has(key)) continue;
    seen.add(key);
    const slot =
      item.slot === "morning" ||
      item.slot === "afternoon" ||
      item.slot === "evening"
        ? item.slot
        : undefined;
    const goalTypeRaw =
      item.goalType === "financial" ||
      item.goalType === "savings" ||
      item.goalType === "weight"
        ? item.goalType
        : undefined;
    const goalType =
      goalTypeRaw === "savings"
        ? "financial"
        : goalTypeRaw === "financial" || goalTypeRaw === "weight"
          ? goalTypeRaw
          : undefined;
    const goalTarget =
      typeof item.goalTarget === "number" && Number.isFinite(item.goalTarget)
        ? item.goalTarget
        : undefined;
    const checkEveryDays =
      typeof item.checkEveryDays === "number" &&
      Number.isFinite(item.checkEveryDays)
        ? item.checkEveryDays
        : undefined;
    tasks.push({
      title,
      slot,
      asTemplate: item.asTemplate === true,
      goalType,
      goalTarget,
      checkEveryDays,
    });
  }
  return tasks;
}
