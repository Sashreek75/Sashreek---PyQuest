
import { GoogleGenAI, Type } from "@google/genai";
import { CodeEvaluation } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const evaluateQuestCode = async (
  questTitle: string,
  objective: string,
  userCode: string
): Promise<CodeEvaluation> => {
  const prompt = `
    You are an expert Machine Learning Instructor for PyQuest.
    Review the following Python code for the quest: "${questTitle}".
    Objective: ${objective}
    
    User Code:
    \`\`\`python
    ${userCode}
    \`\`\`
    
    Tasks:
    1. Check if the code logically solves the objective using the requested tools (NumPy, Pandas, etc.).
    2. Provide constructive feedback.
    3. Simulate some metrics (accuracy, loss) if applicable.
    4. Generate mock visualization data for Recharts (array of objects with 'epoch', 'loss', 'accuracy').
    
    Response MUST be a JSON object matching this schema:
    {
      "status": "success" | "partial" | "error",
      "feedback": "string",
      "metrics": { "accuracy": number, "loss": number },
      "visualizationData": [ { "epoch": number, "loss": number, "val_loss": number, "accuracy": number } ]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING },
            feedback: { type: Type.STRING },
            metrics: {
              type: Type.OBJECT,
              properties: {
                accuracy: { type: Type.NUMBER },
                loss: { type: Type.NUMBER }
              }
            },
            visualizationData: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  epoch: { type: Type.NUMBER },
                  loss: { type: Type.NUMBER },
                  val_loss: { type: Type.NUMBER },
                  accuracy: { type: Type.NUMBER }
                }
              }
            }
          }
        }
      }
    });

    return JSON.parse(response.text || '{}') as CodeEvaluation;
  } catch (error) {
    return { status: 'error', feedback: "Evaluation failed. Error: " + error };
  }
};

export const getAIHint = async (questTitle: string, objective: string, code: string): Promise<string> => {
  const prompt = `User is stuck on PyQuest: "${questTitle}". Objective: ${objective}. Code: ${code}. Give a 1-2 sentence conceptual hint.`;
  try {
    const response = await ai.models.generateContent({ model: "gemini-3-flash-preview", contents: prompt });
    return response.text || "Keep trying!";
  } catch { return "AI mentor offline."; }
};

export const generateCareerStrategy = async (interests: string, skills: string[]): Promise<string> => {
  const prompt = `
    Create an ACHIEVABLE, REALISTIC STRATEGIC CAREER PLAN for a young learner (student/kid) who wants to pursue technology.
    Interests: ${interests}
    Current Python Skills: ${skills.join(', ')}
    
    The plan should be motivating, friendly, and broken into 3 phases:
    1. The Near Future (Learning)
    2. The Intermediate Phase (Building Projects)
    3. The Professional Goal (Career Vision)
    
    Format as Markdown. Keep it concise but inspiring.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: { thinkingConfig: { thinkingBudget: 1000 } }
    });
    return response.text || "Failed to generate strategy.";
  } catch { return "Career advisor unavailable."; }
};
