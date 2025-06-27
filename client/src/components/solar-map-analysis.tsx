import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Search, Zap, DollarSign, TrendingUp, Leaf } from "lucide-react";

interface SolarData {
  maxArrayPanelsCount: number;
  yearlyEnergyDc: number;
  systemSizeKw: number;
  address: string;
  estimatedGrossCost: number;
  roofArea: number;
  solarPotentialRating: string;
}

export default function SolarMapAnalysis() {
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [solarData, setSolarData] = useState<SolarData | null>(null);
  const [error, setError] = useState("");
  const mapRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // BC Address suggestions for common commercial locations
  const bcCommonAddresses = [
    "1200 West Georgia Street, Vancouver, BC",
    "999 West Hastings Street, Vancouver, BC", 
    "200 Granville Street, Vancouver, BC",
    "1166 Alberni Street, Vancouver, BC",
    "800 Robson Street, Vancouver, BC",
    "500 Burrard Street, Vancouver, BC",
    "1075 West Georgia Street, Vancouver, BC",
    "777 Dunsmuir Street, Vancouver, BC",
    "1111 West Georgia Street, Vancouver, BC",
    "355 Burrard Street, Vancouver, BC"
  ];

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleAddressChange = (value: string) => {
    setAddress(value);
    
    if (value.length > 2) {
      const filtered = bcCommonAddresses.filter(addr => 
        addr.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const selectAddress = (selectedAddress: string) => {
    setAddress(selectedAddress);
    setShowSuggestions(false);
  };

  const analyzeSolarPotential = async () => {
    if (!address) {
      setError("Please enter a valid BC business address");
      return;
    }

    setIsLoading(true);
    setError("");
    setSolarData(null);

    try {
      // Call our backend API which will integrate with Google Solar API
      const response = await fetch('/api/analyze-solar-potential', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze solar potential');
      }

      const data = await response.json();
      setSolarData(data);
      
      toast({
        title: "Analysis Complete",
        description: "Solar potential data has been generated for your property.",
      });
    } catch (err) {
      setError("Unable to analyze this address. Please try a different BC commercial address.");
      toast({
        title: "Analysis Failed",
        description: "Could not retrieve solar data for this location.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Assess Your Property's Solar Potential
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Enter your business address to get an instant, data-driven analysis of your building's 
            rooftop solar potential using BC-specific regional climate data.
          </p>
        </div>

        {/* Address Input */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <div className="flex rounded-md shadow-sm">
              <Input
                id="solar-address-input"
                type="text"
                value={address}
                onChange={(e) => handleAddressChange(e.target.value)}
                onFocus={() => address.length > 2 && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="flex-1 rounded-l-md border-r-0"
                placeholder="Enter your BC business address"
              />
              <Button
                onClick={analyzeSolarPotential}
                disabled={isLoading || !address}
                className="bg-blue-600 text-white hover:bg-blue-700 rounded-l-none"
              >
                <Search className="h-4 w-4 mr-2" />
                {isLoading ? "Analyzing..." : "Analyze"}
              </Button>
            </div>
            
            {/* Address Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-12 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                    onMouseDown={() => selectAddress(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
          {error && (
            <p className="mt-2 text-red-600 text-sm text-center">{error}</p>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center mb-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Results */}
        {solarData && (
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Map */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Property Satellite View</h3>
              <div
                ref={mapRef}
                className="w-full h-96 rounded-lg border border-gray-200"
              />
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center text-blue-800">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span className="font-medium">{solarData.address}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Solar Data */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">Solar Analysis Results</h3>
              
              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4 text-center">
                    <Zap className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600">
                      {formatNumber(solarData.systemSizeKw)} kW
                    </div>
                    <div className="text-sm text-gray-600">Max System Size</div>
                  </CardContent>
                </Card>

                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-600">
                      {formatNumber(solarData.yearlyEnergyDc)} kWh
                    </div>
                    <div className="text-sm text-gray-600">Annual Production</div>
                  </CardContent>
                </Card>

                <Card className="bg-purple-50 border-purple-200">
                  <CardContent className="p-4 text-center">
                    <DollarSign className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-600">
                      {formatCurrency(solarData.estimatedGrossCost)}
                    </div>
                    <div className="text-sm text-gray-600">Estimated Cost</div>
                  </CardContent>
                </Card>

                <Card className="bg-yellow-50 border-yellow-200">
                  <CardContent className="p-4 text-center">
                    <Leaf className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-yellow-600">
                      {solarData.solarPotentialRating}
                    </div>
                    <div className="text-sm text-gray-600">Solar Rating</div>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Information */}
              <Card className="bg-gray-50">
                <CardHeader>
                  <CardTitle className="text-lg">Property Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Available Roof Area:</span>
                    <span className="font-semibold">{formatNumber(solarData.roofArea)} sq ft</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Solar Panels:</span>
                    <span className="font-semibold">{formatNumber(solarData.maxArrayPanelsCount)} panels</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cost per Watt:</span>
                    <span className="font-semibold">$2.50/W</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-600 font-medium">Estimated Annual Savings:</span>
                    <span className="font-bold text-green-600">
                      {formatCurrency(solarData.yearlyEnergyDc * 0.12)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* CTA */}
              <Button className="w-full bg-green-600 text-white hover:bg-green-700 py-3">
                Get Detailed Financial Analysis
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}