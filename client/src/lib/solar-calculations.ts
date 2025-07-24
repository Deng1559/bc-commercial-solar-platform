export interface SolarCalculationInputs {
  systemSize: number; // kW
  monthlyUsage: number; // kWh
  currentBill: number; // CAD
  rateTier: string;
  installationType: string;
  panelQuality: string;
  batteryStorage: string;
  location: string;
}

export interface SolarCalculationResults {
  systemSize: number;
  annualProduction: number;
  totalCost: number;
  cleanBcRebates: number;
  federalIncentives: number;
  netCost: number;
  annualSavings: number;
  paybackPeriod: number;
  roi25Year: number;
  co2OffsetAnnual: number;
}

// BC Solar irradiance data (kWh/m²/day by region)
const BC_SOLAR_IRRADIANCE: Record<string, number> = {
  vancouver: 3.2,
  victoria: 3.5,
  kelowna: 3.8,
  kamloops: 3.6,
  prince_george: 3.1,
  default: 3.3, // BC average
};

// Commercial electricity rates by tier (CAD/kWh)
const BC_COMMERCIAL_RATES: Record<string, number> = {
  "Small General Service": 0.1139,
  "Medium General Service": 0.1059,
  "Large General Service": 0.0879,
  "Transmission Service": 0.0759,
};

/**
 * BC Commercial Solar Platform - Solar Calculation Engine
 * 
 * Copyright (c) 2025 Dennis Eng
 * Website: www.klicksmartai.com
 * 
 * Advanced solar calculation algorithms for British Columbia commercial properties.
 * Includes BC-specific irradiance data, incentive calculations, and ROI analysis.
 */

import { calculationCache } from './calculation-cache';

export function calculateCommercialSolar(inputs: SolarCalculationInputs): SolarCalculationResults {
  // Check cache first
  const cachedResult = calculationCache.get(inputs);
  if (cachedResult) {
    return cachedResult;
  }

  // Input validation
  if (!inputs || typeof inputs !== 'object') {
    throw new Error('Invalid input data provided');
  }

  const {
    systemSize,
    monthlyUsage,
    currentBill,
    rateTier,
    installationType,
    panelQuality,
    batteryStorage,
    location,
  } = inputs;

  // Validate required inputs
  if (systemSize <= 0 || monthlyUsage <= 0 || currentBill <= 0) {
    throw new Error('System size, monthly usage, and current bill must be positive numbers');
  }

  if (!rateTier || !installationType || !panelQuality || !batteryStorage) {
    throw new Error('All configuration options must be selected');
  }

  // Get solar irradiance for location with fallback
  const locationKey = location?.toLowerCase() || 'default';
  const irradiance = BC_SOLAR_IRRADIANCE[locationKey] || BC_SOLAR_IRRADIANCE.default;
  
  // System efficiency factors
  let systemEfficiency = 0.85; // Base efficiency
  
  // Adjust for panel quality
  switch (panelQuality) {
    case "High Efficiency":
      systemEfficiency *= 1.1;
      break;
    case "Premium Tier 1":
      systemEfficiency *= 1.15;
      break;
  }
  
  // Adjust for installation type
  switch (installationType) {
    case "Ground-Mount":
      systemEfficiency *= 1.05; // Better orientation/maintenance
      break;
    case "Tracker System":
      systemEfficiency *= 1.25; // Tracking increases production
      break;
  }

  // Annual production calculation
  const peakSunHours = irradiance * 365;
  const annualProduction = systemSize * peakSunHours * systemEfficiency;

  // Cost calculations
  let baseCostPerKw = 1750; // Base commercial cost per kW
  
  // Adjust cost for installation type
  switch (installationType) {
    case "Ground-Mount":
      baseCostPerKw *= 1.1;
      break;
    case "Carport/Canopy":
      baseCostPerKw *= 1.3;
      break;
    case "Tracker System":
      baseCostPerKw *= 1.5;
      break;
  }
  
  // Adjust cost for panel quality
  switch (panelQuality) {
    case "High Efficiency":
      baseCostPerKw *= 1.15;
      break;
    case "Premium Tier 1":
      baseCostPerKw *= 1.25;
      break;
  }

  let totalCost = systemSize * baseCostPerKw;
  
  // Add battery storage cost
  switch (batteryStorage) {
    case "50kWh Commercial Battery":
      totalCost += 75000;
      break;
    case "100kWh Commercial Battery":
      totalCost += 140000;
      break;
    case "200kWh+ Custom Solution":
      totalCost += 250000;
      break;
  }

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

  // Annual savings calculation
  const energyRate = BC_COMMERCIAL_RATES[rateTier] || BC_COMMERCIAL_RATES["Medium General Service"];
  const annualSavings = annualProduction * energyRate;

  // Payback period
  const paybackPeriod = netCost / annualSavings;

  // 25-year ROI calculation
  const totalSavings25Year = annualSavings * 25;
  const roi25Year = ((totalSavings25Year - netCost) / netCost) * 100;

  // CO2 offset calculation (BC grid emission factor: 0.42 kg CO2/kWh)
  const co2OffsetAnnual = (annualProduction * 0.42) / 1000; // tonnes

  const result = {
    systemSize,
    annualProduction: Math.round(annualProduction),
    totalCost: Math.round(totalCost),
    cleanBcRebates: Math.round(cleanBcRebates),
    federalIncentives: Math.round(federalIncentives),
    netCost: Math.round(netCost),
    annualSavings: Math.round(annualSavings),
    paybackPeriod: Math.round(paybackPeriod * 10) / 10,
    roi25Year: Math.round(roi25Year * 10) / 10,
    co2OffsetAnnual: Math.round(co2OffsetAnnual * 10) / 10,
  };

  // Cache the result
  calculationCache.set(inputs, result);
  
  return result;
}

export function estimateRoofArea(buildingSquareFootage: number, buildingType: string): number {
  // Estimate usable roof area based on building type
  const roofAreaFactors: Record<string, number> = {
    "Manufacturing": 0.7, // Large flat roofs
    "Warehouse/Distribution": 0.8, // Very large flat roofs
    "Retail/Commercial": 0.5, // Mixed roof types
    "Office Building": 0.6, // Moderate roof space
    "Healthcare": 0.4, // Complex roof structures
    "Education": 0.5, // Mixed building types
    "Agriculture": 0.6, // Large barn-style buildings
    "Other": 0.5, // Conservative estimate
  };

  const factor = roofAreaFactors[buildingType] || 0.5;
  return Math.round(buildingSquareFootage * factor);
}

export function optimizeSystemSize(
  availableRoofArea: number,
  monthlyUsage: number,
  peakDemand: number
): number {
  // Panel efficiency: ~350W per panel, ~20 sq ft per panel
  const panelArea = 20; // sq ft per panel
  const panelCapacity = 0.35; // kW per panel
  
  // Maximum system size based on roof area
  const maxPanels = Math.floor(availableRoofArea / panelArea);
  const maxSystemSize = maxPanels * panelCapacity;
  
  // Optimal system size based on usage (annual consumption / production factor)
  const annualUsage = monthlyUsage * 12;
  const productionFactor = 1200; // kWh per kW per year in BC
  const optimalSystemSize = annualUsage / productionFactor;
  
  // Recommended system size (conservative approach)
  const recommendedSize = Math.min(maxSystemSize, optimalSystemSize * 0.9);
  
  // Ensure minimum size and round to nearest 5kW
  return Math.max(20, Math.round(recommendedSize / 5) * 5);
}
