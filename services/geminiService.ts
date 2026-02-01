
import { GoogleGenAI, Type } from "@google/genai";
import { CodeEvaluation } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Evaluates the user's Python code using the Gemini model.
 * Provides logical validation, technical feedback, and simulated performance metrics.
 */
export const evaluateQuestCode = async (
  questTitle: string,
  objective: string,
  userCode: string
): Promise<CodeEvaluation> => {
  const systemInstruction = `
    You are a world-class Machine Learning Scientist and Python Mentor at PyQuest Academy.
    Your goal is to evaluate student code submissions for technical accuracy, efficiency, and adherence to ML best practices.
  `;

  const prompt = `
    QUEST CONTEXT:
    Title: "${questTitle}"
    Objective: "${objective}"
    
    STUDENT SUBMISSION:
    \`\`\`python
    ${userCode}
    \`\`\`
    
    EVALUATION REQUIREMENTS:
    1. LINTING: Identify if the code runs logically based on Python syntax.
    2. OBJECTIVE CHECK: Does the code fulfill the specific quest objective?
    3. FEEDBACK: Provide 2-3 sentences of professional, encouraging technical critique.
    4. METRICS: If the quest involves data/ML, simulate performance metrics (accuracy 0-1, loss 0-2).
    5. VISUALIZATION: Provide an array of 5 data points for a Recharts LineChart showing a simulated training curve.
    6. ADVICE: One sentence of "Mentor Wisdom" for their next steps.

    RESPOND ONLY IN JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING, enum: ['success', 'partial', 'error'] },
            feedback: { type: Type.STRING },
            mentorAdvice: { type: Type.STRING },
            metrics: {
              type: Type.OBJECT,
              properties: {
                accuracy: { type: Type.NUMBER },
                loss: { type: Type.NUMBER },
                precision: { type: Type.NUMBER }
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

    const parsed = JSON.parse(response.text || '{}');
    return parsed as CodeEvaluation;
  } catch (error) {
    console.error("Evaluation error:", error);
    return { 
      status: 'error', 
      feedback: "The simulation environment encountered an error. Please verify your logic and try again." 
    };
  }
};

/**
 * Fetches a contextual hint from the AI mentor.
 */
export const getAIHint = async (questTitle: string, objective: string, code: string): Promise<string> => {
  const prompt = `
    Student is working on "${questTitle}". 
    Objective: ${objective}
    Current Code: ${code}
    
    Provide a subtle, 20-word conceptual hint that doesn't reveal the code solution but points them in the right direction.
  `;
  
  try {
    const response = await ai.models.generateContent({ 
      model: "gemini-3-flash-preview", 
      contents: prompt 
    });
    return response.text?.trim() || "Think about the data transformation process.";
  } catch {
    return "Consider reviewing the core Python documentation for this module.";
  }
};

/**
 * Generates a high-fidelity career strategy based on user interests and progress.
 */
export const generateCareerStrategy = async (interests: string, completedQuests: string[]): Promise<string> => {
  const prompt = `
    Generate a detailed, multi-phase technical career roadmap for a PyQuest student.
    USER INTERESTS: ${interests}
    COMPLETED MODULES: ${completedQuests.join(', ')}
    
    Structure:
    1. CURRENT POSITIONING: Analysis of their skill set.
    2. THE GROWTH PATH: Next 3 critical technologies to master.
    3. THE PROJECT LAB: 2 ambitious project ideas tailored to their interests.
    4. INDUSTRY FORECAST: Where their skills will be most valuable in 2026.
    
    Use a professional, inspiring tone. Use Markdown.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 16000 }
      }
    });
    return response.text || "Strategy generation timed out.";
  } catch {
    return "Career advisory services are currently under maintenance. Please try again later.";
  }
};
