import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSolarProjectSchema, insertSolarCalculationSchema } from "@shared/schema";
import { ZodError } from "zod";

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
      const { address } = req.body;
      if (!address) {
        return res.status(400).json({ message: "Address is required" });
      }

      // Mock Google Solar API response for development
      // In production, integrate with actual Google Solar API
      const mockSolarData = {
        maxArrayPanelsCount: Math.floor(Math.random() * 200) + 50,
        yearlyEnergyDc: Math.floor(Math.random() * 100000) + 50000,
        systemSizeKw: Math.floor(Math.random() * 200) + 50,
        address: address,
        estimatedGrossCost: 0,
        roofArea: Math.floor(Math.random() * 15000) + 5000,
        solarPotentialRating: ["High", "Medium", "Good"][Math.floor(Math.random() * 3)]
      };

      // Calculate estimated cost
      mockSolarData.estimatedGrossCost = mockSolarData.systemSizeKw * 1000 * 2.50;

      res.json(mockSolarData);
    } catch (error) {
      res.status(500).json({ message: "Failed to analyze solar potential" });
    }
  });

  // Submit lead generation form
  app.post("/api/leads", async (req, res) => {
    try {
      const leadData = req.body;
      
      // In production, integrate with CRM system (Salesforce, HubSpot, etc.)
      console.log("New solar lead submission:", {
        timestamp: new Date().toISOString(),
        business: leadData.businessName,
        contact: `${leadData.firstName} ${leadData.lastName}`,
        email: leadData.email,
        phone: leadData.phone,
        businessType: leadData.businessType,
        monthlyBill: leadData.monthlyElectricityBill,
        timeframe: leadData.timeframe,
        primaryGoal: leadData.primaryGoal,
      });

      // Send confirmation email (in production)
      // await sendLeadConfirmationEmail(leadData.email, leadData.firstName);

      // Notify sales team (in production)
      // await notifySalesTeam(leadData);

      res.json({ 
        message: "Lead submitted successfully",
        leadId: Math.random().toString(36).substr(2, 9).toUpperCase()
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to submit lead" });
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
