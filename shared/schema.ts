import { pgTable, text, serial, integer, boolean, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const solarProjects = pgTable("solar_projects", {
  id: serial("id").primaryKey(),
  businessName: text("business_name").notNull(),
  businessType: text("business_type").notNull(),
  contactEmail: text("contact_email").notNull(),
  contactPhone: text("contact_phone"),
  propertyAddress: text("property_address").notNull(),
  buildingSquareFootage: integer("building_square_footage"),
  availableRoofArea: integer("available_roof_area"),
  monthlyElectricityUsage: integer("monthly_electricity_usage"), // kWh
  monthlyElectricityBill: real("monthly_electricity_bill"), // CAD
  peakDemand: integer("peak_demand"), // kW
  currentRateTier: text("current_rate_tier"),
  desiredSystemSize: integer("desired_system_size"), // kW
  installationType: text("installation_type"),
  panelQuality: text("panel_quality"),
  batteryStorage: text("battery_storage"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const solarCalculations = pgTable("solar_calculations", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  systemSize: integer("system_size"), // kW
  annualProduction: integer("annual_production"), // kWh
  totalCost: real("total_cost"), // CAD
  cleanBcRebates: real("clean_bc_rebates"), // CAD
  federalIncentives: real("federal_incentives"), // CAD
  netCost: real("net_cost"), // CAD
  annualSavings: real("annual_savings"), // CAD
  paybackPeriod: real("payback_period"), // years
  roi25Year: real("roi_25_year"), // percentage
  co2OffsetAnnual: real("co2_offset_annual"), // tonnes
  createdAt: timestamp("created_at").defaultNow(),
});

export const bcRateStructure = pgTable("bc_rate_structure", {
  id: serial("id").primaryKey(),
  rateTier: text("rate_tier").notNull(),
  energyRate: real("energy_rate"), // CAD per kWh
  demandRate: real("demand_rate"), // CAD per kW
  basicCharge: real("basic_charge"), // CAD per month
});

export const insertSolarProjectSchema = createInsertSchema(solarProjects).omit({
  id: true,
  createdAt: true,
});

export const insertSolarCalculationSchema = createInsertSchema(solarCalculations).omit({
  id: true,
  createdAt: true,
});

export const insertBcRateStructureSchema = createInsertSchema(bcRateStructure).omit({
  id: true,
});

export type InsertSolarProject = z.infer<typeof insertSolarProjectSchema>;
export type SolarProject = typeof solarProjects.$inferSelect;
export type InsertSolarCalculation = z.infer<typeof insertSolarCalculationSchema>;
export type SolarCalculation = typeof solarCalculations.$inferSelect;
export type InsertBcRateStructure = z.infer<typeof insertBcRateStructureSchema>;
export type BcRateStructure = typeof bcRateStructure.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});
