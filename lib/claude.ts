import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export type GeneratedQuestion = {
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
};

export async function generateQuizQuestions(
  topic: string,
  count: number = 3,
  previousQuestions: string[] = []
): Promise<GeneratedQuestion[]> {
  const avoidList =
    previousQuestions.length > 0
      ? `\n\nDo NOT repeat these questions:\n${previousQuestions.map((q, i) => `${i + 1}. ${q}`).join("\n")}`
      : "";

  const prompt = `You are an expert coding instructor. Generate exactly ${count} multiple-choice quiz questions about: ${topic}

Requirements:
- Questions must be practical and test real understanding, not just definitions
- Each question must have exactly 4 options (A, B, C, D)
- Vary difficulty: mix conceptual and code-based questions
- Explanations must be clear and educational (2-3 sentences)
- Questions should feel different from each other${avoidList}

Respond ONLY with a valid JSON array, no markdown, no extra text:
[
  {
    "question": "question text here",
    "options": ["option A", "option B", "option C", "option D"],
    "correct_index": 0,
    "explanation": "explanation here"
  }
]`;

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1500,
    messages: [{ role: "user", content: prompt }],
  });

  const text =
    message.content[0].type === "text" ? message.content[0].text : "";
  const clean = text.replace(/```json|```/g, "").trim();
  const parsed: GeneratedQuestion[] = JSON.parse(clean);
  return parsed;
}

export async function explainCodeError(
  code: string,
  error: string,
  language: string
): Promise<string> {
  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 400,
    messages: [
      {
        role: "user",
        content: `A student got this error in their ${language} code:\n\nCode:\n${code}\n\nError: ${error}\n\nExplain what went wrong in 2-3 sentences and give a one-line fix hint. Be encouraging.`,
      },
    ],
  });
  return message.content[0].type === "text" ? message.content[0].text : "";
}
