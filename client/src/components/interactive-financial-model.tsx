import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { TrendingUp, DollarSign, Clock, Calculator } from "lucide-react";

interface FinancialResults {
  paybackPeriod: number;
  irr: number;
  year1Savings: number;
  netCostAfterIncentives: number;
  totalIncentives: number;
  roi25Year: number;
  cumulativeSavings25Year: number;
}

export default function InteractiveFinancialModel() {
  const [systemCost, setSystemCost] = useState([2.50]); // $ per Watt
  const [rateEscalation, setRateEscalation] = useState([3.75]); // % annual
  const [systemSize, setSystemSize] = useState([100]); // kW
  const [energyRate, setEnergyRate] = useState([0.1080]); // $ per kWh
  const [results, setResults] = useState<FinancialResults | null>(null);

  const calculateFinancials = () => {
    const systemSizeKw = systemSize[0];
    const costPerWatt = systemCost[0];
    const escalationRate = rateEscalation[0] / 100;
    const currentEnergyRate = energyRate[0];

    // System cost calculations
    const grossSystemCost = systemSizeKw * 1000 * costPerWatt;
    
    // Annual production (BC average: 1200 kWh/kW/year)
    const annualProduction = systemSizeKw * 1200;
    
    // Incentives calculation
    const federalITC = grossSystemCost * 0.30; // 30% Federal ITC
    const bcHydroRebate = Math.min(systemSizeKw * 1000, 10000); // $1000/kW up to $10k
    const pstSavings = grossSystemCost * 0.07; // 7% PST exemption
    const totalIncentives = federalITC + bcHydroRebate + pstSavings;
    
    // Net cost after incentives
    const netCost = grossSystemCost - totalIncentives;
    
    // Year 1 savings
    const year1Savings = annualProduction * currentEnergyRate;
    
    // Payback calculation
    const paybackPeriod = netCost / year1Savings;
    
    // 25-year financial analysis
    let cumulativeSavings = 0;
    let currentRate = currentEnergyRate;
    
    for (let year = 1; year <= 25; year++) {
      const yearlyProduction = annualProduction * Math.pow(0.993, year - 1); // 0.7% annual degradation
      const yearlySavings = yearlyProduction * currentRate;
      cumulativeSavings += yearlySavings;
      currentRate *= (1 + escalationRate);
    }
    
    // IRR calculation (simplified)
    const irr = ((cumulativeSavings / netCost) ** (1/25) - 1) * 100;
    
    // 25-year ROI
    const roi25Year = ((cumulativeSavings - netCost) / netCost) * 100;

    return {
      paybackPeriod,
      irr,
      year1Savings,
      netCostAfterIncentives: netCost,
      totalIncentives,
      roi25Year,
      cumulativeSavings25Year: cumulativeSavings,
    };
  };

  useEffect(() => {
    setResults(calculateFinancials());
  }, [systemCost, rateEscalation, systemSize, energyRate]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercent = (percent: number) => {
    return `${percent.toFixed(1)}%`;
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Interactive Financial Modeling
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Model your own project. Use the sliders to adjust key assumptions and see in real-time 
            how they impact your payback period, long-term returns, and overall savings.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Controls */}
            <div className="space-y-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Adjust Your Parameters
              </h3>

              {/* System Size */}
              <div className="space-y-3">
                <Label htmlFor="system-size" className="text-sm font-medium text-gray-700">
                  System Size (kW): {systemSize[0]} kW
                </Label>
                <Slider
                  id="system-size"
                  min={20}
                  max={500}
                  step={10}
                  value={systemSize}
                  onValueChange={setSystemSize}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>20 kW</span>
                  <span>500 kW</span>
                </div>
              </div>

              {/* System Cost */}
              <div className="space-y-3">
                <Label htmlFor="system-cost" className="text-sm font-medium text-gray-700">
                  System Cost ($ per Watt): ${systemCost[0].toFixed(2)}/W
                </Label>
                <Slider
                  id="system-cost"
                  min={2.20}
                  max={3.00}
                  step={0.05}
                  value={systemCost}
                  onValueChange={setSystemCost}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>$2.20/W</span>
                  <span>$3.00/W</span>
                </div>
              </div>

              {/* Rate Escalation */}
              <div className="space-y-3">
                <Label htmlFor="rate-escalation" className="text-sm font-medium text-gray-700">
                  Annual Electricity Rate Escalation: {rateEscalation[0].toFixed(2)}%
                </Label>
                <Slider
                  id="rate-escalation"
                  min={2.0}
                  max={6.0}
                  step={0.25}
                  value={rateEscalation}
                  onValueChange={setRateEscalation}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>2.0%</span>
                  <span>6.0%</span>
                </div>
              </div>

              {/* Energy Rate */}
              <div className="space-y-3">
                <Label htmlFor="energy-rate" className="text-sm font-medium text-gray-700">
                  Current Energy Rate: ${energyRate[0].toFixed(4)}/kWh
                </Label>
                <Slider
                  id="energy-rate"
                  min={0.08}
                  max={0.15}
                  step={0.005}
                  value={energyRate}
                  onValueChange={setEnergyRate}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>$0.08/kWh</span>
                  <span>$0.15/kWh</span>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Key Performance Indicators ({systemSize[0]} kW System)
              </h3>

              {results && (
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-green-50 border-green-200 transform transition-transform hover:scale-105">
                    <CardContent className="p-6 text-center">
                      <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-green-600">
                        {results.paybackPeriod.toFixed(1)} Yrs
                      </div>
                      <div className="text-sm text-gray-600">Payback Period</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-blue-50 border-blue-200 transform transition-transform hover:scale-105">
                    <CardContent className="p-6 text-center">
                      <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-blue-600">
                        {formatPercent(results.irr)}
                      </div>
                      <div className="text-sm text-gray-600">25-Year IRR</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-purple-50 border-purple-200 transform transition-transform hover:scale-105">
                    <CardContent className="p-6 text-center">
                      <DollarSign className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-purple-600">
                        {formatCurrency(results.year1Savings)}
                      </div>
                      <div className="text-sm text-gray-600">Year 1 Savings</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-yellow-50 border-yellow-200 transform transition-transform hover:scale-105">
                    <CardContent className="p-6 text-center">
                      <Calculator className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-yellow-600">
                        {formatCurrency(results.netCostAfterIncentives)}
                      </div>
                      <div className="text-sm text-gray-600">Net Investment</div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {results && (
                <Card className="bg-gray-50">
                  <CardHeader>
                    <CardTitle className="text-lg">Investment Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gross System Cost:</span>
                      <span className="font-semibold">
                        {formatCurrency(systemSize[0] * 1000 * systemCost[0])}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Incentives:</span>
                      <span className="font-semibold text-green-600">
                        -{formatCurrency(results.totalIncentives)}
                      </span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-gray-600 font-medium">Net Investment:</span>
                      <span className="font-bold">
                        {formatCurrency(results.netCostAfterIncentives)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">25-Year Savings:</span>
                      <span className="font-bold text-green-600">
                        {formatCurrency(results.cumulativeSavings25Year)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">25-Year ROI:</span>
                      <span className="font-bold text-green-600">
                        {formatPercent(results.roi25Year)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="grid grid-cols-1 gap-3">
                <Button className="bg-green-600 text-white hover:bg-green-700">
                  ✨ Explain These Numbers
                </Button>
                <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                  📝 Generate Investment Memo
                </Button>
                <Button className="bg-red-600 text-white hover:bg-red-700">
                  ⚖️ Analyze Risks & Opportunities
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}