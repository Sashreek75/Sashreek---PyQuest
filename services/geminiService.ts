import { GoogleGenAI, Type } from "@google/genai";
import { CodeEvaluation, RoadmapData } from "../types";

/**
 * Lead AI Mentor: Aura
 * Lead Strategic Architect: PyQuest Strategic Architect
 */

export const evaluateQuestCode = async (
  questTitle: string,
  objective: string,
  userCode: string
): Promise<CodeEvaluation> => {
  // Always use a new instance to ensure it uses the most up-to-date API key from the environment.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `
    You are 'Aura', the Lead AI Mentor at PyQuest Academy. Evaluate Python ML code.
    Check syntax, logic, best practices. Generate realistic metrics and Recharts visualization data.
    Return JSON only.
  `;

  const prompt = `
    QUEST: ${questTitle} | OBJECTIVE: ${objective}
    CODE: \`\`\`python\n${userCode}\n\`\`\`
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING },
            feedback: { type: Type.STRING },
            technicalDetails: { type: Type.STRING },
            mentorAdvice: { type: Type.STRING },
            suggestedResources: { type: Type.ARRAY, items: { type: Type.STRING } },
            metrics: {
              type: Type.OBJECT,
              properties: {
                accuracy: { type: Type.NUMBER },
                loss: { type: Type.NUMBER },
                precision: { type: Type.NUMBER },
                f1_score: { type: Type.NUMBER }
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
          },
          required: ["status", "feedback", "technicalDetails"]
        }
      }
    });
    // Guidelines specify using response.text property directly
    return JSON.parse(response.text || '{}') as CodeEvaluation;
  } catch (error) {
    return { 
      status: 'error', 
      feedback: "Audit kernel failure. Please check your network connection and API key configuration.", 
      technicalDetails: String(error), 
      suggestedResources: [] 
    };
  }
};

export const getAIHint = async (questTitle: string, objective: string, code: string): Promise<string> => {
  try {
    // Creating a new instance right before the call as per recommended best practices for key management.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({ 
      model: "gemini-3-flash-preview",
      contents: `Quest: ${questTitle}. Objective: ${objective}. Current Code: ${code}. Provide a short socratic hint (max 30 words).`
    });
    // Accessing text via property as per Correct Method guidelines
    return response.text?.trim() || "Analyze your mathematical operations.";
  } catch (error) {
    console.error("Hint generation failed:", error);
    return "The mentor is momentarily offline. Review your logic structure.";
  }
};

export const generateCareerStrategy = async (
  interest: string,
  completedQuestIds: string[]
): Promise<RoadmapData> => {
  const systemInstruction = `
    You are the 'PyQuest Strategic Architect'. Generate a visual tech roadmap for a user interested in ${interest}.
    
    RULES:
    1. Analyze completedQuestIds: ${JSON.stringify(completedQuestIds)} to determine 'Mastered' vs 'Active' vs 'Locked' nodes.
    2. Provide 8-12 nodes in a sequential or branching tech tree.
    3. Include 'duration' for each node.
    4. Provide x (0-100) and y (increments of 100-150) coordinates.
    5. Return JSON ONLY.
  `;

  try {
    // Initializing Gemini client with process.env.API_KEY as required
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `User Interest: ${interest}. Completed Quest IDs: ${completedQuestIds.join(', ')}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            careerPath: { type: Type.STRING },
            summary: { type: Type.STRING },
            nodes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  duration: { type: Type.STRING },
                  status: { type: Type.STRING },
                  category: { type: Type.STRING },
                  tags: { type: Type.ARRAY, items: { type: Type.STRING } },
                  dependencies: { type: Type.ARRAY, items: { type: Type.STRING } },
                  recommendedResources: { type: Type.ARRAY, items: { type: Type.STRING } },
                  x: { type: Type.NUMBER },
                  y: { type: Type.NUMBER }
                },
                required: ["id", "title", "status", "x", "y", "tags", "recommendedResources"]
              }
            }
          },
          required: ["title", "nodes", "careerPath", "summary"]
        }
      }
    });
    return JSON.parse(response.text || '{}') as RoadmapData;
  } catch (error) {
    console.error("Roadmap generation failed:", error);
    throw error;
  }
};