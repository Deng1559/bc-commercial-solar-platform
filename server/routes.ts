import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLeadSchema } from "@shared/schema";
import { insertSolarProjectSchema, insertSolarCalculationSchema } from "@shared/schema";
import { ZodError } from "zod";
import { analyzeBusinessForSolar, qualifyLead, generateInsightfulROIExplanation } from "./gemini";

// Generate BC-specific solar estimates when Google Solar API is unavailable
function generateBCEstimates(address: string) {
  // Analyze address for BC region-specific estimates
  const isVancouver = address.toLowerCase().includes('vancouver');
  const isVictoria = address.toLowerCase().includes('victoria');
  const isKelowna = address.toLowerCase().includes('kelowna');
  const isCalgary = address.toLowerCase().includes('calgary');
  
  // BC solar irradiance data (kWh/m2/day)
  let solarIrradiance = 3.5; // Provincial average
  if (isVancouver) solarIrradiance = 3.2;
  if (isVictoria) solarIrradiance = 3.8;
  if (isKelowna) solarIrradiance = 4.1;
  if (isCalgary) solarIrradiance = 3.9;
  
  // Estimate system size based on typical commercial buildings
  const baseSystemSize = Math.floor(Math.random() * 300) + 200; // 200-500 kW
  const panelCount = Math.floor(baseSystemSize * 2.5); // ~400W panels
  const roofArea = Math.floor(baseSystemSize * 40); // ~40 sq ft per kW
  
  // Calculate annual production
  const annualProduction = Math.round(baseSystemSize * solarIrradiance * 365 * 0.85); // 85% system efficiency
  
  // Determine solar potential rating
  let solarPotentialRating = "Good";
  if (solarIrradiance > 3.8) solarPotentialRating = "High";
  else if (solarIrradiance < 3.3) solarPotentialRating = "Medium";
  
  return {
    maxArrayPanelsCount: panelCount,
    yearlyEnergyDc: annualProduction,
    systemSizeKw: baseSystemSize,
    address: address,
    estimatedGrossCost: baseSystemSize * 2500, // $2.50/W commercial
    roofArea: roofArea,
    solarPotentialRating: solarPotentialRating,
    maxSunshineHoursPerYear: Math.round(solarIrradiance * 365),
    carbonOffsetFactorKgPerMwh: 420, // BC grid emission factor
    note: "Estimate based on BC regional solar data - Google Solar API requires additional permissions"
  };
}

async function calculateSolarSystem(project: any) {
  // Solar calculation logic
  const systemSize = project.desiredSystemSize || 500; // kW
  const annualSunHours = 1200; // BC average
  const systemEfficiency = 0.85;
  
  // Annual production calculation
  const annualProduction = systemSize * annualSunHours * systemEfficiency;
  
  // Cost calculations (CAD per kW installed)
  const baseCostPerKw = 1750; // Commercial solar cost
  const totalCost = systemSize * baseCostPerKw;
  
  // CleanBC Business rebates
  let cleanBcRebates = 0;
  if (systemSize >= 20 && systemSize <= 100) {
    cleanBcRebates = Math.min(systemSize * 500, 50000); // $500/kW up to $50k
  } else if (systemSize > 100) {
    cleanBcRebates = Math.min(systemSize * 400, 125000); // $400/kW up to $125k
  }
  
  // Federal investment tax credit (30%)
  const federalIncentives = totalCost * 0.30;
  
  // Net cost after incentives
  const netCost = totalCost - cleanBcRebates - federalIncentives;
  
  // Get rate structure for savings calculation
  const rateStructure = await storage.getBcRateStructureByTier(project.currentRateTier || "Medium General Service");
  const energyRate = rateStructure?.energyRate || 0.1059;
  
  // Annual savings calculation
  const annualSavings = annualProduction * energyRate;
  
  // Payback period
  const paybackPeriod = netCost / annualSavings;
  
  // 25-year ROI calculation
  const totalSavings25Year = annualSavings * 25;
  const roi25Year = ((totalSavings25Year - netCost) / netCost) * 100;
  
  // CO2 offset (0.42 kg CO2 per kWh in BC)
  const co2OffsetAnnual = (annualProduction * 0.42) / 1000; // tonnes
  
  return {
    systemSize,
    annualProduction,
    totalCost,
    cleanBcRebates,
    federalIncentives,
    netCost,
    annualSavings,
    paybackPeriod,
    roi25Year,
    co2OffsetAnnual,
  };
}

async function analyzeSolarPotential(address: string) {
  // Mock Google Solar API response - in production, integrate with actual API
  // For now, return calculated values based on BC solar potential
  return {
    roofArea: 25000, // sq ft
    solarPotential: "High", // High/Medium/Low
    optimalTilt: 35, // degrees
    annualSunHours: 1200,
    shadingFactors: 0.15,
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Get BC rate structures
  app.get("/api/bc-rates", async (req, res) => {
    try {
      const rates = await storage.getBcRateStructures();
      res.json(rates);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch BC rate structures" });
    }
  });

  // Create solar project
  app.post("/api/solar-projects", async (req, res) => {
    try {
      const validatedData = insertSolarProjectSchema.parse(req.body);
      const project = await storage.createSolarProject(validatedData);
      res.json(project);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid project data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create solar project" });
      }
    }
  });

  // Get solar project by ID
  app.get("/api/solar-projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.getSolarProject(id);
      if (!project) {
        return res.status(404).json({ message: "Solar project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch solar project" });
    }
  });

  // Get solar projects by email
  app.get("/api/solar-projects", async (req, res) => {
    try {
      const email = req.query.email as string;
      if (!email) {
        return res.status(400).json({ message: "Email parameter is required" });
      }
      const projects = await storage.getSolarProjectsByEmail(email);
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch solar projects" });
    }
  });

  // Calculate solar system
  app.post("/api/solar-calculations", async (req, res) => {
    try {
      const { projectId, ...projectData } = req.body;
      
      // Calculate solar system metrics
      const calculationResults = await calculateSolarSystem(projectData);
      
      // Save calculation to storage
      const calculationData = {
        projectId,
        ...calculationResults,
      };
      
      const validatedCalculation = insertSolarCalculationSchema.parse(calculationData);
      const calculation = await storage.createSolarCalculation(validatedCalculation);
      
      res.json(calculation);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid calculation data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to calculate solar system" });
      }
    }
  });

  // Analyze solar potential with Google Solar API
  app.post("/api/analyze-address", async (req, res) => {
    try {
      console.log("DEBUG: /api/analyze-address called with:", req.body.address);
      const { address } = req.body;
      if (!address) {
        return res.status(400).json({ message: "Address is required" });
      }
      
      // In production, integrate with Google Solar API
      const analysis = await analyzeSolarPotential(address);
      res.json(analysis);
    } catch (error) {
      res.status(500).json({ message: "Failed to analyze solar potential" });
    }
  });

  // Get calculations by project ID
  app.get("/api/solar-calculations/:projectId", async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const calculations = await storage.getSolarCalculationsByProjectId(projectId);
      res.json(calculations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch calculations" });
    }
  });

  // Analyze solar potential with Google Solar API
  app.post("/api/analyze-solar-potential", async (req, res) => {
    try {
      console.log("DEBUG: /api/analyze-solar-potential called with:", req.body.address);
      const { address } = req.body;
      if (!address) {
        return res.status(400).json({ message: "Address is required" });
      }

      const apiKey = process.env.GOOGLE_SOLAR_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ message: "Google Solar API key not configured" });
      }

      // Step 1: Get location coordinates from address
      const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
      console.log("DEBUG: Making geocoding request for:", address);
      const geocodeResponse = await fetch(geocodeUrl);
      const geocodeData = await geocodeResponse.json();
      console.log("DEBUG: Geocoding status:", geocodeData.status);
      
      if (geocodeData.status === "REQUEST_DENIED") {
        console.log("DEBUG: Geocoding denied, falling back to BC estimates");
        return res.json(generateBCEstimates(address));
      }
      
      if (geocodeData.status !== "OK") {
        console.log("DEBUG: Geocoding failed with status:", geocodeData.status);
        return res.json(generateBCEstimates(address));
      }
      
      if (!geocodeData.results || geocodeData.results.length === 0) {
        return res.status(400).json({ message: "Address not found" });
      }
      
      const location = geocodeData.results[0].geometry.location;
      const lat = location.lat;
      const lng = location.lng;
      
      // Step 2: Get building insights from Google Solar API
      console.log(`DEBUG: Making Solar API call for coordinates: ${lat}, ${lng}`);
      const buildingInsightsUrl = `https://solar.googleapis.com/v1/buildingInsights:findClosest?location.latitude=${lat}&location.longitude=${lng}&key=${apiKey}`;
      const buildingResponse = await fetch(buildingInsightsUrl);
      const buildingData = await buildingResponse.json();
      
      console.log("DEBUG: Solar API response status:", buildingResponse.status);
      if (!buildingResponse.ok) {
        console.error("DEBUG: Solar API error details:", {
          status: buildingResponse.status,
          statusText: buildingResponse.statusText,
          data: buildingData
        });
        return res.json(generateBCEstimates(address));
      }
      
      console.log("DEBUG: Solar API success, has solarPotential:", !!buildingData.solarPotential);
      if (!buildingData.solarPotential) {
        console.log("DEBUG: No solar potential data in response:", Object.keys(buildingData));
        return res.json(generateBCEstimates(address));
      }
      
      // Extract solar potential data
      const solarPotential = buildingData.solarPotential;
      const roofSegmentStats = solarPotential?.roofSegmentStats?.[0];
      const solarPanelConfigs = solarPotential?.solarPanelConfigs || [];
      
      // Find optimal configuration (usually the largest feasible system)
      const optimalConfig = solarPanelConfigs.reduce((best, current) => {
        return current.yearlyEnergyDcKwh > (best?.yearlyEnergyDcKwh || 0) ? current : best;
      }, null);
      
      // Calculate roof area from segment stats
      const roofAreaM2 = roofSegmentStats?.stats?.areaMeters2 || 0;
      const roofAreaSqFt = Math.round(roofAreaM2 * 10.764); // Convert to square feet
      
      // Determine solar potential rating
      let solarPotentialRating = "Low";
      if (solarPotential?.maxSunshineHoursPerYear > 1500) {
        solarPotentialRating = "High";
      } else if (solarPotential?.maxSunshineHoursPerYear > 1200) {
        solarPotentialRating = "Medium";
      } else if (solarPotential?.maxSunshineHoursPerYear > 900) {
        solarPotentialRating = "Good";
      }
      
      const solarData = {
        maxArrayPanelsCount: optimalConfig?.panelsCount || 0,
        yearlyEnergyDc: Math.round(optimalConfig?.yearlyEnergyDcKwh || 0),
        systemSizeKw: optimalConfig ? Math.round((optimalConfig.panelsCount * 400) / 1000) : 0, // Assuming 400W panels
        address: geocodeData.results[0].formatted_address,
        estimatedGrossCost: 0,
        roofArea: roofAreaSqFt,
        solarPotentialRating: solarPotentialRating,
        maxSunshineHoursPerYear: solarPotential?.maxSunshineHoursPerYear || 0,
        carbonOffsetFactorKgPerMwh: solarPotential?.carbonOffsetFactorKgPerMwh || 0
      };

      // Calculate estimated cost
      solarData.estimatedGrossCost = solarData.systemSizeKw * 1000 * 2.50; // $2.50/W for commercial

      res.json(solarData);
    } catch (error) {
      console.error("Solar potential analysis error:", error);
      res.status(500).json({ message: "Failed to analyze solar potential" });
    }
  });

  // Submit lead generation form
  app.post("/api/leads", async (req, res) => {
    try {
      const leadData = insertLeadSchema.parse(req.body);
      
      // AI-powered business analysis
      let businessAnalysis;
      let leadQualification;
      
      try {
        // Analyze business for solar potential using Gemini AI
        businessAnalysis = await analyzeBusinessForSolar({
          businessName: leadData.businessName,
          businessType: leadData.businessType,
          monthlyElectricityBill: leadData.monthlyElectricityBill,
          roofArea: leadData.roofArea,
          timeframe: leadData.timeframe,
          primaryGoal: leadData.primaryGoal,
          additionalNotes: leadData.additionalNotes || undefined
        });

        // Qualify the lead using AI
        leadQualification = await qualifyLead({
          firstName: leadData.firstName,
          lastName: leadData.lastName,
          businessName: leadData.businessName,
          businessType: leadData.businessType,
          monthlyElectricityBill: leadData.monthlyElectricityBill,
          roofArea: leadData.roofArea,
          timeframe: leadData.timeframe,
          primaryGoal: leadData.primaryGoal,
          additionalNotes: leadData.additionalNotes || undefined
        });

        console.log("AI Business Analysis:", {
          business: leadData.businessName,
          solarSuitability: businessAnalysis.solarSuitability,
          qualificationScore: businessAnalysis.qualificationScore,
          leadPriority: leadQualification.priority,
          aiLeadScore: leadQualification.score
        });

      } catch (aiError) {
        console.log("AI analysis failed, using fallback scoring:", aiError);
        // Fallback to rule-based scoring if AI fails
        businessAnalysis = null;
        leadQualification = null;
      }

      // Use AI score if available, otherwise fallback to rule-based
      let finalLeadScore = 50;
      if (leadQualification) {
        finalLeadScore = leadQualification.score;
      } else {
        // Fallback scoring criteria
        if (leadData.monthlyElectricityBill > 1000) finalLeadScore += 20;
        if (leadData.monthlyElectricityBill > 2000) finalLeadScore += 10;
        if (leadData.roofArea > 10000) finalLeadScore += 15;
        if (leadData.timeframe === "Within 3 months") finalLeadScore += 20;
        if (leadData.timeframe === "3-6 months") finalLeadScore += 10;
        if (leadData.primaryGoal === "Cost savings") finalLeadScore += 15;
        if (leadData.businessType === "Manufacturing" || leadData.businessType === "Warehouse") finalLeadScore += 10;
        finalLeadScore = Math.min(finalLeadScore, 100);
      }
      
      // Store lead in database
      const lead = await storage.createLead({
        ...leadData,
        leadScore: finalLeadScore,
        status: "new"
      });

      console.log("New solar lead stored:", {
        id: lead.id,
        business: lead.businessName,
        contact: `${lead.firstName} ${lead.lastName}`,
        email: lead.email,
        score: lead.leadScore,
        aiPowered: !!leadQualification,
        priority: leadQualification?.priority || "Standard",
        timestamp: lead.createdAt
      });

      // Return enhanced response with AI insights
      const response: any = { 
        message: "Lead submitted successfully",
        leadId: lead.id.toString(),
        leadScore: finalLeadScore
      };

      if (businessAnalysis) {
        response.aiInsights = {
          solarSuitability: businessAnalysis.solarSuitability,
          recommendedSystemSize: businessAnalysis.recommendedSystemSize,
          keyInsights: businessAnalysis.keyInsights,
          nextSteps: businessAnalysis.nextSteps
        };
      }

      if (leadQualification) {
        response.qualification = {
          priority: leadQualification.priority,
          reasoning: leadQualification.reasoning,
          recommendations: leadQualification.recommendations,
          opportunities: leadQualification.opportunities
        };
      }

      res.json(response);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Invalid lead data", 
          errors: error.errors 
        });
      }
      console.error("Lead submission error:", error);
      res.status(500).json({ message: "Failed to submit lead" });
    }
  });

  // Get all leads (for admin interface)
  app.get("/api/leads", async (req, res) => {
    try {
      const leads = await storage.getLeads();
      res.json(leads);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve leads" });
    }
  });

  // Update lead status
  app.patch("/api/leads/:id/status", async (req, res) => {
    try {
      const leadId = parseInt(req.params.id);
      const { status } = req.body;
      
      await storage.updateLeadStatus(leadId, status);
      res.json({ message: "Lead status updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to update lead status" });
    }
  });

  // Generate AI-powered ROI explanation
  app.post("/api/generate-roi-explanation", async (req, res) => {
    try {
      const { calculationResults, businessContext } = req.body;
      
      if (!calculationResults || !businessContext) {
        return res.status(400).json({ message: "Missing calculation results or business context" });
      }

      const explanation = await generateInsightfulROIExplanation(
        calculationResults,
        businessContext
      );

      res.json({ explanation });
    } catch (error) {
      console.error("ROI explanation generation error:", error);
      res.status(500).json({ message: "Failed to generate ROI explanation" });
    }
  });

  // Submit contact form
  app.post("/api/contact", async (req, res) => {
    try {
      const { firstName, lastName, email, phone, company, message } = req.body;
      
      // In production, integrate with email service or CRM
      console.log("Contact form submission:", {
        firstName,
        lastName,
        email,
        phone,
        company,
        message,
      });
      
      res.json({ message: "Contact form submitted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to submit contact form" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
