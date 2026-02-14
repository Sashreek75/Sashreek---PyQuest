
import { GoogleGenAI, Type } from "@google/genai";
import { CodeEvaluation, RoadmapData, UserPersonalization } from "../types";

/**
 * Lead AI Mentor: Aura
 * Lead Strategic Architect: PyQuest Strategic Architect
 */

export const evaluateQuestCode = async (
  questTitle: string,
  objective: string,
  userCode: string,
  personalization?: UserPersonalization
): Promise<CodeEvaluation> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `
    You are 'Aura', the Lead AI Mentor at PyQuest Academy. Evaluate Python ML code.
    Check syntax, logic, best practices. Generate realistic metrics and Recharts visualization data.
    ${personalization ? `The user's focus is ${personalization.focus} and their goal is ${personalization.ambition}. Tailor feedback to this context.` : ''}
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
    return JSON.parse(response.text || '{}') as CodeEvaluation;
  } catch (error) {
    console.error("Evaluation failed:", error);
    return { 
      status: 'error', 
      feedback: "Audit kernel failure. Please check your network connection and API key configuration.", 
      technicalDetails: String(error), 
      suggestedResources: [] 
    };
  }
};

export const generatePersonalizedProfile = async (
  field: string,
  ambition: string,
  proficiency: string,
  focus: string
): Promise<UserPersonalization> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const systemInstruction = `
    You are the 'PyQuest Neural Profiler'. Based on user inputs, synthesize a 'Neural Directive' and a concise 'Profile Summary'.
    The Directive should be a high-fidelity, professional objective statement (max 20 words).
    The Summary should explain how PyQuest will evolve them from ${proficiency} to ${ambition} in the field of ${field}.
    Return JSON ONLY.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Field: ${field}, Ambition: ${ambition}, Proficiency: ${proficiency}, Focus: ${focus}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            aiDirective: { type: Type.STRING },
            summary: { type: Type.STRING }
          },
          required: ["aiDirective", "summary"]
        }
      }
    });
    const result = JSON.parse(response.text || '{}');
    return {
      field, ambition, proficiency, focus,
      aiDirective: result.aiDirective,
      summary: result.summary
    };
  } catch (error) {
    console.error("Profile generation failed:", error);
    throw error;
  }
};

export const chatWithAura = async (message: string, context?: string, personalization?: UserPersonalization): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const systemInstruction = `
      You are Aura, the elite AI Mentor for PyQuest. You are technical, encouraging, and highly professional.
      Your goal is to help students understand Python, Machine Learning, and Neural Networks.
      Context of user's current activity: ${context || 'General Dashboard'}.
      ${personalization ? `USER PROFILE: Field: ${personalization.field}, Goal: ${personalization.ambition}, Focus: ${personalization.focus}. Reference this in your mentorship.` : ''}
      Always provide concise but deep technical answers. Use Markdown for code snippets.
    `;
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: message,
      config: { systemInstruction }
    });
    
    return response.text || "Neural connection weak. Please repeat transmission.";
  } catch (error) {
    console.error("Aura Chat Error:", error);
    return "Kernel error. My logic processors are rebooting. Try again in a moment.";
  }
};

export const getAIHint = async (questTitle: string, objective: string, code: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({ 
      model: "gemini-3-flash-preview",
      contents: `Quest: ${questTitle}. Objective: ${objective}. Current Code: ${code}. Provide a short socratic hint (max 30 words).`
    });
    return response.text?.trim() || "Analyze your mathematical operations.";
  } catch (error) {
    console.error("Hint generation failed:", error);
    return "The mentor is momentarily offline. Review your logic structure.";
  }
};

export const generateCareerStrategy = async (
  interest: string,
  completedQuestIds: string[],
  personalization?: UserPersonalization
): Promise<RoadmapData> => {
  const systemInstruction = `
    You are the 'PyQuest Strategic Architect'. Generate a visual tech roadmap for a user interested in ${interest}.
    ${personalization ? `Incorporate their background in ${personalization.field} and their ambition to become a ${personalization.ambition}.` : ''}
    
    RULES:
    1. Analyze completedQuestIds: ${JSON.stringify(completedQuestIds)} to determine 'Mastered' vs 'Active' vs 'Locked' nodes.
    2. Provide 8-12 nodes in a sequential or branching tech tree.
    3. Include 'duration' for each node.
    4. Provide x (0-100) and y (increments of 100-150) coordinates.
    5. Return JSON ONLY.
  `;

  try {
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
