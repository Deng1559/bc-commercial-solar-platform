import { GoogleGenAI } from "@google/genai";

if (!process.env.GEMINI_API_KEY) {
  console.warn("GEMINI_API_KEY not set - AI features will use fallback responses");
}

const ai = process.env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null;

export interface BusinessAnalysis {
  energyProfile: string;
  solarSuitability: number; // 1-10 scale
  businessTypeAssessment: string;
  recommendedSystemSize: number;
  timeframePriority: string;
  qualificationScore: number; // 1-100 scale
  keyInsights: string[];
  nextSteps: string[];
}

export interface LeadQualification {
  score: number; // 1-100
  priority: "High" | "Medium" | "Low";
  reasoning: string;
  recommendations: string[];
  riskFactors: string[];
  opportunities: string[];
}

export async function analyzeBusinessForSolar(businessData: {
  businessName: string;
  businessType: string;
  monthlyElectricityBill: number;
  roofArea: number;
  timeframe: string;
  primaryGoal: string;
  additionalNotes?: string;
}): Promise<BusinessAnalysis> {
  const prompt = `
Analyze this commercial business for solar potential:

Business: ${businessData.businessName}
Type: ${businessData.businessType}
Monthly Electricity Bill: $${businessData.monthlyElectricityBill} CAD
Roof Area: ${businessData.roofArea} sq ft
Implementation Timeframe: ${businessData.timeframe}
Primary Goal: ${businessData.primaryGoal}
Additional Notes: ${businessData.additionalNotes || "None"}

Provide a comprehensive analysis including:
1. Energy consumption profile assessment
2. Solar suitability rating (1-10 scale)
3. Business type specific considerations
4. Recommended system size range (kW)
5. Timeframe priority assessment
6. Overall qualification score (1-100)
7. Key insights for this business type
8. Recommended next steps

Respond with JSON in this format:
{
  "energyProfile": "description of energy usage patterns",
  "solarSuitability": number (1-10),
  "businessTypeAssessment": "business-specific solar considerations",
  "recommendedSystemSize": number (in kW),
  "timeframePriority": "priority level based on timeframe",
  "qualificationScore": number (1-100),
  "keyInsights": ["insight1", "insight2", "insight3"],
  "nextSteps": ["step1", "step2", "step3"]
}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            energyProfile: { type: "string" },
            solarSuitability: { type: "number" },
            businessTypeAssessment: { type: "string" },
            recommendedSystemSize: { type: "number" },
            timeframePriority: { type: "string" },
            qualificationScore: { type: "number" },
            keyInsights: {
              type: "array",
              items: { type: "string" }
            },
            nextSteps: {
              type: "array",
              items: { type: "string" }
            }
          },
          required: ["energyProfile", "solarSuitability", "businessTypeAssessment", "recommendedSystemSize", "timeframePriority", "qualificationScore", "keyInsights", "nextSteps"]
        }
      },
      contents: prompt
    });

    const rawJson = response.text;
    if (rawJson) {
      return JSON.parse(rawJson);
    } else {
      throw new Error("Empty response from Gemini");
    }
  } catch (error) {
    console.error("Gemini analysis error:", error);
    // Return fallback analysis
    return {
      energyProfile: "Unable to analyze - manual assessment required",
      solarSuitability: 5,
      businessTypeAssessment: "Standard commercial analysis needed",
      recommendedSystemSize: Math.round(businessData.monthlyElectricityBill * 0.15), // Rough estimate
      timeframePriority: businessData.timeframe === "Within 3 months" ? "High" : "Medium",
      qualificationScore: 50,
      keyInsights: ["Manual review required for detailed analysis"],
      nextSteps: ["Schedule consultation call", "Site assessment", "Custom proposal preparation"]
    };
  }
}

export async function qualifyLead(leadData: {
  firstName: string;
  lastName: string;
  businessName: string;
  businessType: string;
  monthlyElectricityBill: number;
  roofArea: number;
  timeframe: string;
  primaryGoal: string;
  additionalNotes?: string;
}, solarAnalysis?: any): Promise<LeadQualification> {
  const prompt = `
Qualify this commercial solar lead:

Contact: ${leadData.firstName} ${leadData.lastName}
Business: ${leadData.businessName} (${leadData.businessType})
Monthly Bill: $${leadData.monthlyElectricityBill} CAD
Roof Area: ${leadData.roofArea} sq ft
Timeframe: ${leadData.timeframe}
Goal: ${leadData.primaryGoal}
Notes: ${leadData.additionalNotes || "None"}

${solarAnalysis ? `Solar Analysis Available:
- Max panels: ${solarAnalysis.maxArrayPanelsCount}
- Annual energy: ${solarAnalysis.yearlyEnergyDc} kWh
- System size: ${solarAnalysis.systemSizeKw} kW
- Roof area: ${solarAnalysis.roofArea} sq ft
- Solar rating: ${solarAnalysis.solarPotentialRating}` : ''}

Provide lead qualification including:
1. Overall qualification score (1-100)
2. Priority level (High/Medium/Low)
3. Detailed reasoning for the score
4. Specific recommendations for this lead
5. Risk factors to consider
6. Business opportunities identified

Respond with JSON format:
{
  "score": number (1-100),
  "priority": "High" | "Medium" | "Low",
  "reasoning": "detailed explanation",
  "recommendations": ["rec1", "rec2", "rec3"],
  "riskFactors": ["risk1", "risk2"],
  "opportunities": ["opp1", "opp2", "opp3"]
}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            score: { type: "number" },
            priority: { type: "string", enum: ["High", "Medium", "Low"] },
            reasoning: { type: "string" },
            recommendations: {
              type: "array",
              items: { type: "string" }
            },
            riskFactors: {
              type: "array",
              items: { type: "string" }
            },
            opportunities: {
              type: "array",
              items: { type: "string" }
            }
          },
          required: ["score", "priority", "reasoning", "recommendations", "riskFactors", "opportunities"]
        }
      },
      contents: prompt
    });

    const rawJson = response.text;
    if (rawJson) {
      return JSON.parse(rawJson);
    } else {
      throw new Error("Empty response from Gemini");
    }
  } catch (error) {
    console.error("Gemini qualification error:", error);
    // Return basic qualification based on business rules
    let score = 50;
    if (leadData.monthlyElectricityBill > 2000) score += 20;
    if (leadData.roofArea > 10000) score += 15;
    if (leadData.timeframe === "Within 3 months") score += 15;
    
    return {
      score: Math.min(score, 100),
      priority: score > 80 ? "High" : score > 60 ? "Medium" : "Low",
      reasoning: "Basic qualification - AI analysis unavailable",
      recommendations: ["Schedule consultation", "Site assessment"],
      riskFactors: ["Manual qualification required"],
      opportunities: ["Cost savings potential", "Environmental benefits"]
    };
  }
}

export async function generateInsightfulROIExplanation(calculationResults: {
  systemSize: number;
  annualProduction: number;
  totalCost: number;
  netCost: number;
  annualSavings: number;
  paybackPeriod: number;
  roi25Year: number;
}, businessContext: {
  businessType: string;
  monthlyBill: number;
  primaryGoal: string;
}): Promise<string> {
  const prompt = `
Generate a personalized ROI explanation for this commercial solar project:

System Details:
- Size: ${calculationResults.systemSize} kW
- Annual Production: ${calculationResults.annualProduction} kWh
- Total Cost: $${calculationResults.totalCost} CAD
- Net Cost (after incentives): $${calculationResults.netCost} CAD
- Annual Savings: $${calculationResults.annualSavings} CAD
- Payback Period: ${calculationResults.paybackPeriod} years
- 25-Year ROI: ${calculationResults.roi25Year}%

Business Context:
- Type: ${businessContext.businessType}
- Current Monthly Bill: $${businessContext.monthlyBill} CAD
- Primary Goal: ${businessContext.primaryGoal}

Create a compelling, personalized explanation that:
1. Contextualizes the ROI for this specific business type
2. Highlights the most relevant financial benefits
3. Addresses their primary goal
4. Explains the timeline and cash flow impact
5. Mentions relevant BC incentives and tax benefits
6. Uses business-friendly language (not too technical)

Keep it to 3-4 paragraphs, professional but engaging tone.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });

    return response.text || "This solar investment offers strong financial returns with significant long-term savings for your business.";
  } catch (error) {
    console.error("Gemini ROI explanation error:", error);
    return `This ${calculationResults.systemSize}kW solar system offers excellent financial returns for your ${businessContext.businessType} business. With annual savings of $${calculationResults.annualSavings} and a payback period of ${calculationResults.paybackPeriod} years, you'll see substantial cost reductions while supporting your ${businessContext.primaryGoal} goals.`;
  }
}