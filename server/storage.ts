import { solarProjects, solarCalculations, bcRateStructure, users, leads, type User, type InsertUser, type SolarProject, type InsertSolarProject, type SolarCalculation, type InsertSolarCalculation, type BcRateStructure, type InsertBcRateStructure, type Lead, type InsertLead } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createSolarProject(project: InsertSolarProject): Promise<SolarProject>;
  getSolarProject(id: number): Promise<SolarProject | undefined>;
  getSolarProjectsByEmail(email: string): Promise<SolarProject[]>;
  
  createSolarCalculation(calculation: InsertSolarCalculation): Promise<SolarCalculation>;
  getSolarCalculationsByProjectId(projectId: number): Promise<SolarCalculation[]>;
  
  getBcRateStructures(): Promise<BcRateStructure[]>;
  getBcRateStructureByTier(tier: string): Promise<BcRateStructure | undefined>;
  
  createLead(lead: InsertLead): Promise<Lead>;
  getLeads(): Promise<Lead[]>;
  getLeadById(id: number): Promise<Lead | undefined>;
  updateLeadStatus(id: number, status: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private solarProjects: Map<number, SolarProject>;
  private solarCalculations: Map<number, SolarCalculation>;
  private bcRateStructures: Map<number, BcRateStructure>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.solarProjects = new Map();
    this.solarCalculations = new Map();
    this.bcRateStructures = new Map();
    this.currentId = 1;
    
    // Initialize BC rate structures
    this.initializeBcRates();
  }

  private initializeBcRates() {
    const rates = [
      {
        id: 1,
        rateTier: "Small General Service",
        energyRate: 0.1139, // CAD per kWh
        demandRate: 5.67, // CAD per kW
        basicCharge: 22.73, // CAD per month
      },
      {
        id: 2,
        rateTier: "Medium General Service",
        energyRate: 0.1059,
        demandRate: 8.95,
        basicCharge: 45.46,
      },
      {
        id: 3,
        rateTier: "Large General Service",
        energyRate: 0.0879,
        demandRate: 12.45,
        basicCharge: 113.65,
      },
      {
        id: 4,
        rateTier: "Transmission Service",
        energyRate: 0.0759,
        demandRate: 15.23,
        basicCharge: 227.30,
      },
    ];

    rates.forEach(rate => {
      this.bcRateStructures.set(rate.id, rate);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createSolarProject(insertProject: InsertSolarProject): Promise<SolarProject> {
    const id = this.currentId++;
    const project: SolarProject = { 
      ...insertProject,
      contactPhone: insertProject.contactPhone || null,
      buildingSquareFootage: insertProject.buildingSquareFootage || null,
      availableRoofArea: insertProject.availableRoofArea || null,
      monthlyElectricityUsage: insertProject.monthlyElectricityUsage || null,
      monthlyElectricityBill: insertProject.monthlyElectricityBill || null,
      peakDemand: insertProject.peakDemand || null,
      currentRateTier: insertProject.currentRateTier || null,
      desiredSystemSize: insertProject.desiredSystemSize || null,
      installationType: insertProject.installationType || null,
      panelQuality: insertProject.panelQuality || null,
      batteryStorage: insertProject.batteryStorage || null,
      id,
      createdAt: new Date(),
    };
    this.solarProjects.set(id, project);
    return project;
  }

  async getSolarProject(id: number): Promise<SolarProject | undefined> {
    return this.solarProjects.get(id);
  }

  async getSolarProjectsByEmail(email: string): Promise<SolarProject[]> {
    return Array.from(this.solarProjects.values()).filter(
      (project) => project.contactEmail === email,
    );
  }

  async createSolarCalculation(insertCalculation: InsertSolarCalculation): Promise<SolarCalculation> {
    const id = this.currentId++;
    const calculation: SolarCalculation = { 
      projectId: insertCalculation.projectId,
      systemSize: insertCalculation.systemSize ?? null,
      annualProduction: insertCalculation.annualProduction ?? null,
      totalCost: insertCalculation.totalCost ?? null,
      cleanBcRebates: insertCalculation.cleanBcRebates ?? null,
      federalIncentives: insertCalculation.federalIncentives ?? null,
      netCost: insertCalculation.netCost ?? null,
      annualSavings: insertCalculation.annualSavings ?? null,
      paybackPeriod: insertCalculation.paybackPeriod ?? null,
      roi25Year: insertCalculation.roi25Year ?? null,
      co2OffsetAnnual: insertCalculation.co2OffsetAnnual ?? null,
      id,
      createdAt: new Date(),
    };
    this.solarCalculations.set(id, calculation);
    return calculation;
  }

  async getSolarCalculationsByProjectId(projectId: number): Promise<SolarCalculation[]> {
    return Array.from(this.solarCalculations.values()).filter(
      (calculation) => calculation.projectId === projectId,
    );
  }

  async getBcRateStructures(): Promise<BcRateStructure[]> {
    return Array.from(this.bcRateStructures.values());
  }

  async getBcRateStructureByTier(tier: string): Promise<BcRateStructure | undefined> {
    return Array.from(this.bcRateStructures.values()).find(
      (rate) => rate.rateTier === tier,
    );
  }

  async createLead(insertLead: InsertLead): Promise<Lead> {
    const id = this.currentId++;
    const lead: Lead = { 
      ...insertLead,
      id,
      status: insertLead.status || "new",
      additionalNotes: insertLead.additionalNotes || null,
      leadScore: insertLead.leadScore || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return lead;
  }

  async getLeads(): Promise<Lead[]> {
    return [];
  }

  async getLeadById(id: number): Promise<Lead | undefined> {
    return undefined;
  }

  async updateLeadStatus(id: number, status: string): Promise<void> {
    // Memory storage - no persistent state
  }
}

// Use DatabaseStorage for persistent PostgreSQL storage
export class DatabaseStorage implements IStorage {
  constructor() {
    this.initializeBcRates();
  }

  private async initializeBcRates() {
    // Check if rate structures already exist
    const existingRates = await db.select().from(bcRateStructure).limit(1);
    if (existingRates.length > 0) {
      return; // Already initialized
    }

    const rates: InsertBcRateStructure[] = [
      {
        rateTier: "Small General Service",
        energyRate: 0.1139, // CAD per kWh
        demandRate: 5.67, // CAD per kW
        basicCharge: 22.73, // CAD per month
      },
      {
        rateTier: "Medium General Service",
        energyRate: 0.1059,
        demandRate: 8.95,
        basicCharge: 45.46,
      },
      {
        rateTier: "Large General Service",
        energyRate: 0.0879,
        demandRate: 12.45,
        basicCharge: 113.65,
      },
      {
        rateTier: "Transmission Service",
        energyRate: 0.0759,
        demandRate: 15.23,
        basicCharge: 227.30,
      },
    ];

    await db.insert(bcRateStructure).values(rates);
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createSolarProject(insertProject: InsertSolarProject): Promise<SolarProject> {
    const [project] = await db
      .insert(solarProjects)
      .values(insertProject)
      .returning();
    return project;
  }

  async getSolarProject(id: number): Promise<SolarProject | undefined> {
    const [project] = await db.select().from(solarProjects).where(eq(solarProjects.id, id));
    return project || undefined;
  }

  async getSolarProjectsByEmail(email: string): Promise<SolarProject[]> {
    return await db.select().from(solarProjects).where(eq(solarProjects.contactEmail, email));
  }

  async createSolarCalculation(insertCalculation: InsertSolarCalculation): Promise<SolarCalculation> {
    const [calculation] = await db
      .insert(solarCalculations)
      .values(insertCalculation)
      .returning();
    return calculation;
  }

  async getSolarCalculationsByProjectId(projectId: number): Promise<SolarCalculation[]> {
    return await db.select().from(solarCalculations).where(eq(solarCalculations.projectId, projectId));
  }

  async getBcRateStructures(): Promise<BcRateStructure[]> {
    return await db.select().from(bcRateStructure);
  }

  async getBcRateStructureByTier(tier: string): Promise<BcRateStructure | undefined> {
    const [rate] = await db.select().from(bcRateStructure).where(eq(bcRateStructure.rateTier, tier));
    return rate || undefined;
  }

  async createLead(insertLead: InsertLead): Promise<Lead> {
    const [lead] = await db
      .insert(leads)
      .values(insertLead)
      .returning();
    return lead;
  }

  async getLeads(): Promise<Lead[]> {
    return await db.select().from(leads);
  }

  async getLeadById(id: number): Promise<Lead | undefined> {
    const [lead] = await db.select().from(leads).where(eq(leads.id, id));
    return lead || undefined;
  }

  async updateLeadStatus(id: number, status: string): Promise<void> {
    await db
      .update(leads)
      .set({ status, updatedAt: new Date() })
      .where(eq(leads.id, id));
  }
}

export const storage = new DatabaseStorage();
