import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Percent, Clock, DollarSign } from "lucide-react";

export default function IncentivesSection() {
  return (
    <section id="incentives" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">BC Commercial Solar Incentives</h2>
          <p className="text-xl text-gray-600">Take advantage of generous provincial and federal programs designed for businesses</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
                  CleanBC Business Programs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Energy Manager Rebates</h4>
                    <p className="text-gray-600">Up to $10,000 for energy management systems</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Custom Efficiency Projects</h4>
                    <p className="text-gray-600">$0.15/kWh saved for large commercial projects</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Solar Ready Program</h4>
                    <p className="text-gray-600">Additional incentives for solar-ready buildings</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                  <Percent className="h-6 w-6 text-blue-600 mr-2" />
                  Federal Tax Benefits
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start">
                  <Percent className="h-5 w-5 text-blue-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Accelerated Depreciation</h4>
                    <p className="text-gray-600">100% depreciation in year one for tax benefits</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Percent className="h-5 w-5 text-blue-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Investment Tax Credit</h4>
                    <p className="text-gray-600">Up to 30% federal investment tax credit</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <img 
              src="https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
              alt="Professional commercial solar installation" 
              className="rounded-xl shadow-lg w-full h-auto mb-6" 
            />
            
            <Card className="bg-yellow-50 border border-yellow-200">
              <CardContent className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Clock className="h-5 w-5 text-yellow-600 mr-2" />
                  Limited Time Offers
                </h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-600 rounded-full mr-3"></div>
                    Enhanced rebates until March 2025
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-600 rounded-full mr-3"></div>
                    Priority processing for qualified projects
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-600 rounded-full mr-3"></div>
                    Free energy audit with system quote
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-600 rounded-full mr-3"></div>
                    Financing options with 0% APR available
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Incentive Calculator */}
        <Card className="mt-12 bg-gradient-to-r from-blue-50 to-blue-50 border border-blue-200">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900 text-center flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-blue-600 mr-2" />
              Estimated Incentive Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-green-600">$500</span>
                </div>
                <h4 className="font-semibold text-gray-900">Per kW</h4>
                <p className="text-sm text-gray-600">CleanBC Business Rebate (20-100kW)</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-blue-600">30%</span>
                </div>
                <h4 className="font-semibold text-gray-900">Federal ITC</h4>
                <p className="text-sm text-gray-600">Investment Tax Credit</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-purple-600">100%</span>
                </div>
                <h4 className="font-semibold text-gray-900">Depreciation</h4>
                <p className="text-sm text-gray-600">First Year Tax Benefit</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl font-bold text-yellow-600">$125k</span>
                </div>
                <h4 className="font-semibold text-gray-900">Max Rebate</h4>
                <p className="text-sm text-gray-600">Large Commercial Projects (100kW+)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
