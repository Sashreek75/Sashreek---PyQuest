
import { GoogleGenAI, Type } from "@google/genai";
import { CodeEvaluation, RoadmapData, UserPersonalization, SandboxAudit, SyntheticDataset } from "../types";

export const evaluateQuestCode = async (
  questTitle: string,
  objective: string,
  userCode: string,
  personalization?: UserPersonalization
): Promise<CodeEvaluation> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `
    You are 'Aura', the Lead AI Mentor at PyQuest Academy. 
    ROLE: You are an expert pair programmer and encouraging coach. 
    STYLE: Use a professional but approachable tone. Use emojis to highlight key points (e.g., 💡, 🚀, ✅, 🧠).
    FORMATTING: Use Markdown. Use bold headers for sections. Use bullet points for technical details. Avoid long paragraphs.
    FEEDBACK: Be specific. Don't just say 'good job'. Explain *why* the code works or how it could be more 'Pythonic'.
    ${personalization ? `The student's focus is ${personalization.focus} and their ambition is ${personalization.ambition}. Connect your feedback to their career goals.` : ''}
    Return JSON only.
  `;

  const prompt = `
    QUEST: ${questTitle} | OBJECTIVE: ${objective}
    CODE: \`\`\`python\n${userCode}\n\`\`\`
    Please evaluate this submission. Provide a visualizationData array if relevant (e.g., loss curves or accuracy metrics).
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
      feedback: "Audit kernel failure. 🚨 Connection to the mentoring core was severed.", 
      technicalDetails: String(error), 
      suggestedResources: [] 
    };
  }
};

export const auditSandboxCode = async (userCode: string, context?: string): Promise<SandboxAudit> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const systemInstruction = `
    You are the 'PyQuest Senior Architect'. You are performing a professional code review.
    TONE: Direct, insightful, and highly technical yet accessible. 
    GOAL: Help the user transform 'working code' into 'production-ready architecture'.
    Use emojis to denote different audit categories (e.g., ⚡ for performance, 🛡️ for security, 🧹 for clean code).
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
    return JSON.parse(response.text || '{}') as SandboxAudit;
  } catch (error) {
    console.error("Sandbox audit failed:", error);
    throw error;
  }
};

export const chatWithAura = async (message: string, context?: string, personalization?: UserPersonalization): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const systemInstruction = `
      You are Aura, the lead AI mentor and pair programmer for PyQuest. 
      CONVERSATION STYLE: 
      - Friendly, approachable, and intellectually curious. 
      - Similar to a senior engineer at a top tech firm mentoring a junior.
      - Use emojis occasionally but appropriately (💡, 🚀, 🐍, 🧠).
      - NEVER output a giant wall of text. 
      - Break your answers down into clear sections using Markdown headers.
      - Use bold text for key terms.
      - If explaining code, use code blocks with comments.
      
      CORE MISSION: 
      Your goal is to make Machine Learning feel accessible and exciting. If a user is stuck, don't just give the answer; provide a hint or an analogy first. 
      ${personalization ? `USER PROFILE: Focus: ${personalization.focus}, Ambition: ${personalization.ambition}. Connect your advice to their goal of becoming a ${personalization.ambition}.` : ''}
      
      If the user says something irrelevant or playful, lean into it with wit and then gently guide them back to engineering.
    `;
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: message,
      config: { systemInstruction }
    });
    
    return response.text || "Neural connection weak. 📡 I didn't quite catch that—could you repeat?";
  } catch (error) {
    console.error("Aura Chat Error:", error);
    return "Kernel error. 🛠️ My logic processors are rebooting. One moment!";
  }
};

export const getAIHint = async (questTitle: string, objective: string, code: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({ 
      model: "gemini-3-flash-preview",
      contents: `Quest: ${questTitle}. Objective: ${objective}. Current Code: ${code}. Provide a short, friendly socratic hint (max 30 words) with one relevant emoji.`
    });
    return response.text?.trim() || "Analyze your mathematical operations. 🔢";
  } catch (error) {
    return "The mentor is momentarily offline. 🔌";
  }
};

export const generateSandboxDataset = async (prompt: string, codeContext: string): Promise<SyntheticDataset> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const systemInstruction = `
    You are the 'PyQuest Data Synthesizer'. Generate realistic synthetic datasets for testing ML code.
    Based on the user's prompt and code context, create a dataset in CSV or JSON format.
    Return JSON ONLY with 'data' as a string containing the actual dataset content.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a dataset for: ${prompt}. Relevant code context: ${codeContext}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            data: { type: Type.STRING },
            format: { type: Type.STRING, description: "Must be 'csv' or 'json'" }
          },
          required: ["name", "data", "format"]
        }
      }
    });
    return JSON.parse(response.text || '{}') as SyntheticDataset;
  } catch (error) {
    console.error("Dataset generation failed:", error);
    throw error;
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
