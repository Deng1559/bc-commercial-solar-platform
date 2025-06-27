import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CalculatorForm from "@/components/calculator-form";
import ResultsPanel from "@/components/results-panel";
import IncentivesSection from "@/components/incentives-section";
import InteractiveFinancialModel from "@/components/interactive-financial-model";
import SolarMapAnalysis from "@/components/solar-map-analysis";
import LeadGenerationForm from "@/components/lead-generation-form";
import { Building, Calculator, Award, Factory, Zap, TrendingUp, Leaf, Home } from "lucide-react";

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

export default function CommercialCalculator() {
  const [calculationResults, setCalculationResults] = useState<CalculationResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculationComplete = (results: CalculationResults) => {
    setCalculationResults(results);
    setIsCalculating(false);
  };

  const handleCalculationStart = () => {
    setIsCalculating(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Zap className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">BC Commercial Solar Calculator</h1>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <a href="#calculator" className="text-gray-700 hover:text-blue-600 font-medium">Calculator</a>
              <a href="#financial-model" className="text-gray-700 hover:text-blue-600 font-medium">Financials</a>
              <a href="#solar-analysis" className="text-gray-700 hover:text-blue-600 font-medium">Property Analysis</a>
              <a href="#incentives" className="text-gray-700 hover:text-blue-600 font-medium">Incentives</a>
              <a href="#lead-form" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">Get Quote</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="commercial-gradient text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-yellow-100 text-yellow-800 text-sm font-semibold tracking-wider uppercase rounded-full px-4 py-1 mb-4">
                2025 Limited-Time Incentives
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                BC's Complete Commercial Solar Lead Generation Platform
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                Interactive financial modeling, satellite analysis, and comprehensive lead generation for BC commercial solar installers. Leverage Google Solar API integration and real-time incentive calculations to convert prospects into qualified leads.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  className="bg-white text-blue-600 px-8 py-3 hover:bg-gray-50"
                  onClick={() => document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Start Analysis
                </Button>
                <Button 
                  className="border-2 border-white bg-transparent text-white px-8 py-3 hover:bg-white hover:text-blue-600 transition-colors"
                  onClick={() => document.getElementById('financial-model')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  View Demo
                </Button>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                alt="Commercial building with solar panels" 
                className="rounded-xl shadow-2xl w-full h-auto" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Advanced Commercial Solar Analysis</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Comprehensive tools designed specifically for BC commercial properties and business decision-makers.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="feature-card">
              <CardContent className="text-center p-6">
                <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Calculator className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Satellite Analysis</h3>
                <p className="text-gray-600">AI-powered commercial roof analysis using Google Solar API for accurate system sizing</p>
              </CardContent>
            </Card>
            
            <Card className="feature-card">
              <CardContent className="text-center p-6">
                <div className="w-16 h-16 bg-green-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Financial Analysis</h3>
                <p className="text-gray-600">ROI, payback period, and cash flow analysis with tax incentives and depreciation</p>
              </CardContent>
            </Card>
            
            <Card className="feature-card">
              <CardContent className="text-center p-6">
                <div className="w-16 h-16 bg-yellow-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">BC Rebates</h3>
                <p className="text-gray-600">CleanBC Business program calculations and commercial incentive optimization</p>
              </CardContent>
            </Card>
            
            <Card className="feature-card">
              <CardContent className="text-center p-6">
                <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Factory className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Scalable Systems</h3>
                <p className="text-gray-600">20kW to 1MW+ systems with multiple configuration options and inverter types</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Calculator */}
      <section id="calculator" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Commercial Solar Calculator</h2>
            <p className="text-xl text-gray-600">Enter your business details to get a comprehensive solar analysis</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <CalculatorForm 
                onCalculationStart={handleCalculationStart}
                onCalculationComplete={handleCalculationComplete}
                isCalculating={isCalculating}
              />
            </div>
            
            <div className="lg:col-span-1">
              <ResultsPanel 
                results={calculationResults}
                isCalculating={isCalculating}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Financial Modeling */}
      <div id="financial-model">
        <InteractiveFinancialModel />
      </div>

      {/* Solar Map Analysis */}
      <div id="solar-analysis">
        <SolarMapAnalysis />
      </div>

      {/* BC Commercial Incentives */}
      <IncentivesSection />

      {/* Why Choose Commercial Solar */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why BC Businesses Choose Solar</h2>
            <p className="text-xl text-gray-600">Commercial solar delivers measurable benefits beyond just energy savings</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="bg-white p-8 shadow-lg">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Predictable Energy Costs</h3>
                <p className="text-gray-600 mb-6">Lock in energy costs for 25+ years and protect your business from rising electricity rates.</p>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-lg font-bold text-green-600">3-7% Annual</div>
                  <div className="text-sm text-gray-600">Historical BC Hydro rate increases</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white p-8 shadow-lg">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                  <Leaf className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Environmental Leadership</h3>
                <p className="text-gray-600 mb-6">Demonstrate corporate responsibility and attract environmentally conscious customers and employees.</p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-lg font-bold text-blue-600">500+ tonnes</div>
                  <div className="text-sm text-gray-600">CO2 offset annually (500kW system)</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white p-8 shadow-lg">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                  <Home className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Property Value Increase</h3>
                <p className="text-gray-600 mb-6">Commercial solar installations typically increase property values and attract premium tenants.</p>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-lg font-bold text-purple-600">15-20%</div>
                  <div className="text-sm text-gray-600">Average property value increase</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-12 bg-white p-8 shadow-lg">
            <CardContent className="p-0">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Case Study: BC Manufacturing Company</h3>
                  <p className="text-gray-600 mb-6">A 750kW solar installation helped this Vancouver-area manufacturer reduce energy costs by $180,000 annually while achieving their sustainability goals.</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="metric-card green">
                      <div className="text-2xl font-bold">$180k</div>
                      <div className="text-sm">Annual Savings</div>
                    </div>
                    <div className="metric-card blue">
                      <div className="text-2xl font-bold">5.8 years</div>
                      <div className="text-sm">Payback Period</div>
                    </div>
                  </div>
                </div>
                <div>
                  <img 
                    src="https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                    alt="Large commercial solar installation on manufacturing facility" 
                    className="rounded-xl shadow-lg w-full h-auto" 
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 2025 Urgency Section */}
      <section className="py-16 bg-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block bg-yellow-100 text-yellow-800 text-sm font-semibold tracking-wider uppercase rounded-full px-4 py-1 mb-6">
            Urgent 2025 Opportunity
          </div>
          <h2 className="text-3xl font-bold mb-6">The Urgency of 2025: Why You Need to Act Now</h2>
          <p className="text-lg text-blue-200 mb-6">
            BC Hydro's Self-Generation Program is under a major regulatory review by the BCUC. The current, 
            highly favorable "net metering" rules are expected to be replaced by a new "net billing" structure, 
            likely in 2026. Businesses that secure their interconnection approval in 2025 will likely be 
            "grandfathered" under the current, more lucrative rules.
          </p>
          <p className="text-lg text-blue-200 font-bold mb-8">
            This isn't just an opportunity—it's a strategic deadline to lock in a superior long-term return 
            and mitigate future regulatory risk.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-700 p-6 rounded-lg">
              <h4 className="font-semibold text-xl mb-2">Current Net Metering</h4>
              <p className="text-blue-200">Full retail credit for excess energy production</p>
            </div>
            <div className="bg-yellow-600 p-6 rounded-lg">
              <h4 className="font-semibold text-xl mb-2">2026+ Net Billing</h4>
              <p className="text-yellow-100">Reduced compensation for surplus energy</p>
            </div>
            <div className="bg-green-600 p-6 rounded-lg">
              <h4 className="font-semibold text-xl mb-2">2025 Action</h4>
              <p className="text-green-100">Lock in favorable terms for 25+ years</p>
            </div>
          </div>
          <Button 
            onClick={() => document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-white text-blue-800 font-bold py-3 px-8 rounded-lg text-lg hover:bg-blue-100 transition-colors"
          >
            Secure Your 2025 Solar Project
          </Button>
        </div>
      </section>

      {/* Lead Generation Form */}
      <div id="lead-form">
        <LeadGenerationForm />
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Zap className="h-8 w-8 text-blue-400 mr-3" />
                <h3 className="text-xl font-semibold">BC Solar Solutions</h3>
              </div>
              <p className="text-gray-400 mb-4">Leading commercial solar provider in British Columbia, helping businesses achieve energy independence and sustainability goals.</p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Commercial Solar</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Energy Storage</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Maintenance</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Financing</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Solar Calculator</a></li>
                <li><a href="#" className="hover:text-white transition-colors">BC Incentives</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Case Studies</a></li>
                <li><a href="#" className="hover:text-white transition-colors">ROI Analysis</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-gray-400">
                <p>📞 1-800-BC-SOLAR</p>
                <p>✉️ info@bcsolarsolutions.com</p>
                <p>📍 Vancouver, BC</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 BC Commercial Solar Calculator. All rights reserved. | Licensed Solar Installer in British Columbia</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
