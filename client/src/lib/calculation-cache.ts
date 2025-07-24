/**
 * BC Commercial Solar Platform - Calculation Cache System
 * 
 * Copyright (c) 2025 Dennis Eng
 * Website: www.klicksmartai.com
 * 
 * Intelligent caching system for solar calculations to improve performance
 */

import { SolarCalculationInputs, SolarCalculationResults } from './solar-calculations';

interface CacheEntry {
  result: SolarCalculationResults;
  timestamp: number;
}

class CalculationCache {
  private cache = new Map<string, CacheEntry>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private generateKey(inputs: SolarCalculationInputs): string {
    return JSON.stringify({
      systemSize: inputs.systemSize,
      monthlyUsage: inputs.monthlyUsage,
      currentBill: inputs.currentBill,
      rateTier: inputs.rateTier,
      installationType: inputs.installationType,
      panelQuality: inputs.panelQuality,
      batteryStorage: inputs.batteryStorage,
      location: inputs.location,
    });
  }

  get(inputs: SolarCalculationInputs): SolarCalculationResults | null {
    const key = this.generateKey(inputs);
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    // Check if cache entry is still valid
    if (Date.now() - entry.timestamp > this.CACHE_DURATION) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.result;
  }

  set(inputs: SolarCalculationInputs, result: SolarCalculationResults): void {
    const key = this.generateKey(inputs);
    this.cache.set(key, {
      result,
      timestamp: Date.now(),
    });
    
    // Clean up old entries periodically
    if (this.cache.size > 100) {
      this.cleanup();
    }
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.CACHE_DURATION) {
        this.cache.delete(key);
      }
    }
  }

  clear(): void {
    this.cache.clear();
  }
}

export const calculationCache = new CalculationCache();