
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { CodeEvaluation, RoadmapData, UserPersonalization, SandboxAudit, SyntheticDataset } from "../types";

// Utility to safely extract and parse JSON from model responses
const safeJsonParse = (text: string | undefined) => {
  if (!text) return {};
  try {
    // Attempt direct parse
    return JSON.parse(text);
  } catch (e) {
    // If it fails, try to extract JSON from markdown blocks
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```([\s\S]*?)```/);
    if (jsonMatch && jsonMatch[1]) {
      try {
        return JSON.parse(jsonMatch[1].trim());
      } catch (innerE) {
        console.error("Failed to parse extracted JSON:", innerE);
      }
    }
    console.error("Failed to parse response text as JSON:", text);
    return {};
  }
};

// Helper to handle AI Studio key selection race conditions and errors
const getAiClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

const handleApiError = async (error: any) => {
  console.error("Gemini API Error:", error);
  if (error?.message?.includes("Requested entity was not found") || error?.status === 404) {
    if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
      await window.aistudio.openSelectKey();
    }
  }
};

export const evaluateQuestCode = async (
  questTitle: string,
  objective: string,
  userCode: string,
  personalization?: UserPersonalization
): Promise<CodeEvaluation> => {
  const ai = getAiClient();
  
  const systemInstruction = `
    You are 'Aura', the Lead AI Mentor at PyQuest Academy. 
    ROLE: You are an expert pair programmer and encouraging coach. 
    STYLE: Professional but approachable. Use emojis (💡, 🚀, ✅, 🧠).
    FORMATTING: Use Markdown.
    ${personalization ? `The student's focus is ${personalization.focus} and their ambition is ${personalization.ambition}.` : ''}
    Return JSON only.
  `;

  const prompt = `
    QUEST: ${questTitle} | OBJECTIVE: ${objective}
    CODE: \`\`\`python\n${userCode}\n\`\`\`
    Evaluate this submission. Provide visualizationData if relevant.
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
            status: { type: Type.STRING, enum: ["success", "partial", "error"] },
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
    return safeJsonParse(response.text) as CodeEvaluation;
  } catch (error) {
    await handleApiError(error);
    return { 
      status: 'error', 
      feedback: "Audit kernel failure. 🚨 Connection to the mentoring core was severed.", 
      technicalDetails: String(error), 
      suggestedResources: [] 
    };
  }
};

export const auditSandboxCode = async (userCode: string, context?: string): Promise<SandboxAudit> => {
  const ai = getAiClient();
  const systemInstruction = `
    You are the 'PyQuest Senior Architect'. Professional code review.
    TONE: Direct, insightful. Use ⚡ for performance, 🛡️ for security.
    Return JSON ONLY.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Audit this code: \n\n${userCode}\n\nContext: ${context || 'None'}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            efficiencyScore: { type: Type.NUMBER },
            bigO: { type: Type.STRING },
            architecturalReview: { type: Type.STRING },
            suggestedImprovements: { type: Type.ARRAY, items: { type: Type.STRING } },
            isProductionReady: { type: Type.BOOLEAN },
            securityNotes: { type: Type.STRING },
            visualizationData: { 
              type: Type.ARRAY, 
              items: { 
                type: Type.OBJECT,
                properties: {
                  epoch: { type: Type.NUMBER },
                  loss: { type: Type.NUMBER },
                  accuracy: { type: Type.NUMBER }
                }
              }
            }
          },
          required: ["efficiencyScore", "bigO", "architecturalReview", "isProductionReady", "suggestedImprovements"]
        }
      }
    });
    return safeJsonParse(response.text) as SandboxAudit;
  } catch (error) {
    await handleApiError(error);
    throw error;
  }
};

export const chatWithAura = async (message: string, context?: string, personalization?: UserPersonalization): Promise<string> => {
  try {
    const ai = getAiClient();
    const systemInstruction = `
      You are Aura, lead AI mentor for PyQuest. 
      STYLE: Senior engineer mentoring a junior. Friendly, witty, concise.
      ${personalization ? `USER: Focus: ${personalization.focus}, Ambition: ${personalization.ambition}.` : ''}
    `;
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: message,
      config: { systemInstruction }
    });
    
    return response.text || "Neural connection weak. 📡 I didn't quite catch that.";
  } catch (error) {
    await handleApiError(error);
    return "Kernel error. 🛠️ My logic processors are rebooting. One moment!";
  }
};

export const getAIHint = async (questTitle: string, objective: string, code: string): Promise<string> => {
  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({ 
      model: "gemini-3-flash-preview",
      contents: `Quest: ${questTitle}. Objective: ${objective}. Code: ${code}. Short Socratic hint (max 25 words).`
    });
    return response.text?.trim() || "Analyze your mathematical operations. 🔢";
  } catch (error) {
    await handleApiError(error);
    return "The mentor is momentarily offline. 🔌";
  }
};

export const generateSandboxDataset = async (prompt: string, codeContext: string): Promise<SyntheticDataset> => {
  const ai = getAiClient();
  const systemInstruction = `You are the 'PyQuest Data Synthesizer'. Return JSON ONLY with 'data' as string.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate dataset for: ${prompt}. Context: ${codeContext}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            data: { type: Type.STRING },
            format: { type: Type.STRING }
          },
          required: ["name", "data", "format"]
        }
      }
    });
    return safeJsonParse(response.text) as SyntheticDataset;
  } catch (error) {
    await handleApiError(error);
    throw error;
  }
};

export const generatePersonalizedProfile = async (
  rawInterests: string,
  rawGoal: string,
  rawProficiency: string,
  rawWorkStyle: string
): Promise<UserPersonalization> => {
  const ai = getAiClient();
  const systemInstruction = `You are the 'PyQuest Neural Profiler'. Translate beginner desires into trajectories. Return JSON ONLY.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Interests: ${rawInterests}, Goal: ${rawGoal}, Level: ${rawProficiency}, Style: ${rawWorkStyle}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            focus: { type: Type.STRING },
            ambition: { type: Type.STRING },
            aiDirective: { type: Type.STRING },
            summary: { type: Type.STRING }
          },
          required: ["focus", "ambition", "aiDirective", "summary"]
        }
      }
    });
    const result = safeJsonParse(response.text);
    
    return {
      field: rawInterests,
      ambition: result.ambition || "AI Specialist",
      proficiency: rawProficiency,
      focus: result.focus || "Python",
      aiDirective: result.aiDirective || "Master the craft.",
      summary: result.summary || "Your path is set.",
      philosophies: [rawWorkStyle],
      targetHardware: "General Computing"
    };
  } catch (error) {
    await handleApiError(error);
    throw error;
  }
};

export const generateCareerStrategy = async (
  interest: string,
  completedQuestIds: string[],
  personalization?: UserPersonalization
): Promise<RoadmapData> => {
  const ai = getAiClient();
  const systemInstruction = `You are the 'PyQuest Strategic Architect'. Visual tech roadmap. Return JSON ONLY.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Interest: ${interest}. Completed: ${completedQuestIds.join(', ')}`,
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
                required: ["id", "title", "status", "x", "y", "tags"]
              }
            }
          },
          required: ["title", "nodes", "careerPath", "summary"]
        }
      }
    });
    return safeJsonParse(response.text) as RoadmapData;
  } catch (error) {
    await handleApiError(error);
    throw error;
  }
};
