
import { GoogleGenAI, Type } from "@google/genai";
import { CodeEvaluation, RoadmapData, UserPersonalization } from "../types";

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
    ${personalization ? `The user's professional focus is ${personalization.focus} and their ambition is ${personalization.ambition}. Tailor feedback to this context.` : ''}
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
      feedback: "Audit kernel failure. Connection to the mentoring core was severed.", 
      technicalDetails: String(error), 
      suggestedResources: [] 
    };
  }
};

export const generatePersonalizedProfile = async (
  rawInterests: string,
  rawGoal: string,
  rawProficiency: string,
  rawWorkStyle: string
): Promise<UserPersonalization> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const systemInstruction = `
    You are the 'PyQuest Neural Profiler'. You translate beginner desires into professional AI trajectories.
    INPUT:
    - Interests: ${rawInterests}
    - Life Goal: ${rawGoal}
    - Level: ${rawProficiency}
    - Style: ${rawWorkStyle}

    TASK:
    1. Determine a technical 'focus' (e.g., 'NLP', 'Computer Vision', 'Predictive Analytics').
    2. Determine a technical 'ambition' (e.g., 'Senior MLOps Engineer', 'AI Research Scientist').
    3. Synthesize a 'Neural Directive': A high-fidelity, professional objective statement (max 20 words).
    4. Provide a 'Summary' of their personalized path.
    
    Return JSON ONLY.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: "Generate the technical profile based on these human inputs.",
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
    const result = JSON.parse(response.text || '{}');
    
    return {
      field: rawInterests,
      ambition: result.ambition,
      proficiency: rawProficiency,
      focus: result.focus,
      aiDirective: result.aiDirective,
      summary: result.summary,
      philosophies: [rawWorkStyle],
      targetHardware: "General Computing"
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
      You are Aura, the elite AI Mentor for PyQuest. You are technical but empathetic.
      The student might be a complete beginner. Explain concepts using analogies when needed.
      ${personalization ? `USER PROFILE: Focus: ${personalization.focus}, Ambition: ${personalization.ambition}. Tailor your advice to help them reach this goal.` : ''}
      Use Markdown for code snippets.
    `;
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: message,
      config: { systemInstruction }
    });
    
    return response.text || "Neural connection weak. Please repeat transmission.";
  } catch (error) {
    console.error("Aura Chat Error:", error);
    return "Kernel error. My logic processors are rebooting.";
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
    return "The mentor is momentarily offline.";
  }
};

export const generateCareerStrategy = async (
  interest: string,
  completedQuestIds: string[],
  personalization?: UserPersonalization
): Promise<RoadmapData> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const systemInstruction = `
    You are the 'PyQuest Strategic Architect'. Generate a visual tech roadmap.
    ${personalization ? `Target Role: ${personalization.ambition}. Field: ${personalization.field}.` : ''}
    Provide 8-12 sequential nodes.
    Return JSON ONLY.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `User Interest: ${interest}. Completed: ${completedQuestIds.join(', ')}`,
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
