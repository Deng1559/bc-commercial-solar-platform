import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Zap, DollarSign, Clock, TrendingUp, Leaf } from "lucide-react";

interface CalculationResults {
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

interface ResultsPanelProps {
  results: CalculationResults | null;
  isCalculating: boolean;
}

export default function ResultsPanel({ results, isCalculating }: ResultsPanelProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number, decimals: number = 0) => {
    return new Intl.NumberFormat('en-CA', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num);
  };

  return (
    <Card className="bg-white shadow-lg sticky top-8">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Zap className="h-5 w-5 mr-2 text-blue-600" />
          Solar Analysis Results
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {isCalculating ? (
          <div className="space-y-4">
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <Skeleton className="h-8 w-20 mx-auto mb-2" />
              <Skeleton className="h-4 w-32 mx-auto" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Skeleton className="h-6 w-16 mx-auto mb-1" />
                <Skeleton className="h-3 w-20 mx-auto" />
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Skeleton className="h-6 w-16 mx-auto mb-1" />
                <Skeleton className="h-3 w-20 mx-auto" />
              </div>
            </div>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          </div>
        ) : results ? (
          <div className="space-y-6">
            {/* Main System Size */}
            <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
              <div className="text-3xl font-bold text-green-600 mb-1">
                {formatNumber(results.systemSize)} kW
              </div>
              <div className="text-sm text-gray-600">Recommended System Size</div>
              <Badge variant="secondary" className="mt-2">
                {formatNumber(results.annualProduction)} kWh/year
              </Badge>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="metric-card blue">
                <div className="text-xl font-bold">{formatCurrency(results.annualSavings)}</div>
                <div className="text-xs">Annual Savings</div>
              </div>
              <div className="metric-card purple">
                <div className="text-xl font-bold">{formatNumber(results.paybackPeriod, 1)} years</div>
                <div className="text-xs">Payback Period</div>
              </div>
            </div>

            {/* Financial Breakdown */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center">
                  <DollarSign className="h-4 w-4 mr-1" />
                  Total Investment:
                </span>
                <span className="font-semibold">{formatCurrency(results.totalCost)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">CleanBC Rebates:</span>
                <span className="font-semibold text-green-600">-{formatCurrency(results.cleanBcRebates)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Federal Incentives:</span>
                <span className="font-semibold text-green-600">-{formatCurrency(results.federalIncentives)}</span>
              </div>
              
              <div className="flex justify-between items-center border-t pt-2">
                <span className="text-gray-600 font-medium">Net Investment:</span>
                <span className="font-bold">{formatCurrency(results.netCost)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  25-Year ROI:
                </span>
                <span className="font-bold text-green-600">{formatNumber(results.roi25Year, 1)}%</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center">
                  <Leaf className="h-4 w-4 mr-1" />
                  Annual CO₂ Offset:
                </span>
                <span className="font-semibold text-green-600">{formatNumber(results.co2OffsetAnnual, 1)} tonnes</span>
              </div>
            </div>

            {/* Action Button */}
            <Button className="w-full bg-green-600 text-white hover:bg-green-700">
              <Clock className="h-4 w-4 mr-2" />
              Get Detailed Report
            </Button>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready for Analysis</h3>
            <p className="text-gray-600 text-sm">Fill out the form to calculate your commercial solar potential and see your customized results here.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
