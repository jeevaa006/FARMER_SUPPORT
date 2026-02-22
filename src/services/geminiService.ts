import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface FarmerProfile {
  name: string;
  state: string;
  district: string;
  landSize: string; // e.g., "2 acres"
  primaryCrops: string;
  annualIncome: string;
  category: string; // e.g., "Small/Marginal", "General"
  irrigationType: string;
  insuranceStatus: string; // e.g., "Active", "None"
  soilType: string; // e.g., "Alluvial", "Red"
}

export interface Scheme {
  name: string;
  description: string;
  eligibilityStatus: "Eligible" | "Potentially Eligible" | "Not Eligible";
  reasoning: string;
  benefits: string[];
  formalities: string[];
  requiredDocuments: string[];
  applyUrl: string;
  category: "Irrigation" | "Crops" | "Livestock" | "Machinery" | "Insurance" | "Financial" | "Other";
}

export async function askAgriAdvisor(question: string, profile: FarmerProfile, lang: "en" | "ta" = "en"): Promise<string> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Question: ${question}`,
    config: {
      systemInstruction: `You are an expert agricultural advisor. 
      The farmer's profile is:
      - Location: ${profile.district}, ${profile.state}
      - Land Size: ${profile.landSize}
      - Crops: ${profile.primaryCrops}
      - Soil: ${profile.soilType}
      - Irrigation: ${profile.irrigationType}

      IMPORTANT: You MUST provide the answer in ${lang === "ta" ? "TAMIL LANGUAGE (using Tamil script)" : "ENGLISH LANGUAGE"}.
      ${lang === "ta" ? "DO NOT use English words. Use only Tamil script for the entire response." : ""}
      - Use Markdown formatting for better visualization.
      - Use bullet points for lists.
      - Use small paragraphs for explanations.
      Focus on sustainable practices, government support, and local conditions.`,
    }
  });

  return response.text || (lang === "ta" ? "மன்னிக்கவும், என்னால் பதிலளிக்க முடியவில்லை." : "Sorry, I couldn't generate an answer.");
}

export async function checkEligibility(profile: FarmerProfile, lang: "en" | "ta" = "en"): Promise<Scheme[]> {
  const userPrompt = lang === "ta"
    ? `விவசாயி விவரங்கள்:
    - பெயர்: ${profile.name}
    - இடம்: ${profile.district}, ${profile.state}
    - நில அளவு: ${profile.landSize}
    - பயிர்கள்: ${profile.primaryCrops}
    - வருமானம்: ${profile.annualIncome}
    - வகை: ${profile.category}
    - பாசனம்: ${profile.irrigationType}
    - மண்: ${profile.soilType}

    இந்த விவசாயிக்கு தகுதியான மத்திய மற்றும் மாநில அரசு திட்டங்களை கண்டறியவும்.
    
    கண்டிப்பான விதி: 
    பதிலில் உள்ள அனைத்து உரை புலங்களும் (name, description, reasoning, benefits, formalities, requiredDocuments) கண்டிப்பாக தமிழ் மொழியில் மட்டுமே இருக்க வேண்டும். ஆங்கில எழுத்துக்களை பயன்படுத்தவே கூடாது.`
    : `Analyze government schemes for a farmer named ${profile.name} from ${profile.district}, ${profile.state}. 
    The farmer grows ${profile.primaryCrops} on ${profile.landSize} of ${profile.soilType} soil.
    Return all fields in English.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: userPrompt,
    config: {
      systemInstruction: `You are an expert advisor for Indian government agricultural schemes. 
      Analyze the farmer profile and identify relevant schemes.

      STRICT LANGUAGE RULE:
      ${lang === "ta" 
        ? 'CRITICAL: You MUST translate EVERYTHING into TAMIL script. This includes "name", "description", "reasoning", "benefits", "formalities", and "requiredDocuments". NO ENGLISH CHARACTERS allowed in these fields. Example: Instead of "PM-KISAN", use "பிரதம மந்திரி கிசான் சம்மான் நிதி".' 
        : 'Provide all content in English.'}
      - "eligibilityStatus" MUST be one of: "Eligible", "Potentially Eligible", "Not Eligible".
      - "applyUrl" MUST be a valid URL.
      - "category" MUST be one of: Irrigation, Crops, Livestock, Machinery, Insurance, Financial, Other.`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            eligibilityStatus: { 
              type: Type.STRING,
              description: "Must be one of: Eligible, Potentially Eligible, Not Eligible"
            },
            reasoning: { type: Type.STRING },
            benefits: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            formalities: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            requiredDocuments: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            applyUrl: { type: Type.STRING },
            category: {
              type: Type.STRING,
              description: "Must be one of: Irrigation, Crops, Livestock, Machinery, Insurance, Financial, Other"
            }
          },
          required: ["name", "description", "eligibilityStatus", "reasoning", "benefits", "formalities", "requiredDocuments", "applyUrl", "category"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    return [];
  }
}
