import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateAnalysis(input: {
  idea: string;
  similarStartups: any[];
}) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
You are a startup analyst.

User Idea:
${input.idea}

Similar Startups:
${input.similarStartups.map((s) => s.name).join(", ")}

Give structured analysis:

1. Market Analysis
2. Niche Opportunities
3. Monetization Strategies
4. Risks
5. Improvement Suggestions

Be concise and practical and don't give any false information first analyse your answer and give the response.
`;

  const result = await model.generateContent(prompt);

  return result.response.text();
}