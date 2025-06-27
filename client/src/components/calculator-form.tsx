import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Building, MapPin, Zap, Settings, Satellite } from "lucide-react";

const formSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  businessType: z.string().min(1, "Business type is required"),
  contactEmail: z.string().email("Valid email is required"),
  contactPhone: z.string().optional(),
  propertyAddress: z.string().min(1, "Property address is required"),
  buildingSquareFootage: z.number().min(1000, "Building must be at least 1,000 sq ft"),
  availableRoofArea: z.number().min(500, "Available roof area must be at least 500 sq ft"),
  monthlyElectricityUsage: z.number().min(1000, "Monthly usage must be at least 1,000 kWh"),
  monthlyElectricityBill: z.number().min(500, "Monthly bill must be at least $500"),
  peakDemand: z.number().min(10, "Peak demand must be at least 10 kW"),
  currentRateTier: z.string().min(1, "Rate tier is required"),
  desiredSystemSize: z.number().min(20, "System size must be at least 20 kW"),
  installationType: z.string().min(1, "Installation type is required"),
  panelQuality: z.string().min(1, "Panel quality is required"),
  batteryStorage: z.string().min(1, "Battery storage option is required"),
});

type FormData = z.infer<typeof formSchema>;

interface CalculatorFormProps {
  onCalculationStart: () => void;
  onCalculationComplete: (results: any) => void;
  isCalculating: boolean;
}

export default function CalculatorForm({ onCalculationStart, onCalculationComplete, isCalculating }: CalculatorFormProps) {
  const [systemSize, setSystemSize] = useState([500]);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "",
      businessType: "",
      contactEmail: "",
      contactPhone: "",
      propertyAddress: "",
      buildingSquareFootage: 50000,
      availableRoofArea: 25000,
      monthlyElectricityUsage: 50000,
      monthlyElectricityBill: 8500,
      peakDemand: 200,
      currentRateTier: "",
      desiredSystemSize: 500,
      installationType: "",
      panelQuality: "",
      batteryStorage: "",
    },
  });

  // Fetch BC rate structures
  const { data: bcRates, isLoading: ratesLoading } = useQuery({
    queryKey: ["/api/bc-rates"],
  });

  // Address analysis mutation
  const addressAnalysisMutation = useMutation({
    mutationFn: async (address: string) => {
      const response = await apiRequest("POST", "/api/analyze-address", { address });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Address Analysis Complete",
        description: `Solar potential: ${data.solarPotential}. Roof area: ${data.roofArea} sq ft.`,
      });
      form.setValue("availableRoofArea", data.roofArea);
    },
    onError: () => {
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze address. Please enter roof area manually.",
        variant: "destructive",
      });
    },
  });

  // Solar calculation mutation
  const calculationMutation = useMutation({
    mutationFn: async (data: FormData) => {
      // First create the project
      const projectResponse = await apiRequest("POST", "/api/solar-projects", data);
      const project = await projectResponse.json();
      
      // Then calculate the solar system
      const calculationResponse = await apiRequest("POST", "/api/solar-calculations", {
        projectId: project.id,
        ...data,
      });
      return calculationResponse.json();
    },
    onSuccess: (data) => {
      onCalculationComplete(data);
      toast({
        title: "Calculation Complete",
        description: "Your solar analysis is ready! Check the results panel.",
      });
    },
    onError: () => {
      toast({
        title: "Calculation Failed",
        description: "Unable to calculate solar system. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    onCalculationStart();
    calculationMutation.mutate(data);
  };

  const handleAddressAnalysis = () => {
    const address = form.getValues("propertyAddress");
    if (!address) {
      toast({
        title: "Address Required",
        description: "Please enter a property address first.",
        variant: "destructive",
      });
      return;
    }
    addressAnalysisMutation.mutate(address);
  };

  return (
    <Card className="bg-white shadow-lg">
      <CardContent className="p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Business Information */}
            <div>
              <h3 className="section-header">
                <Building className="h-6 w-6" />
                Business Information
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="businessName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Business Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="businessType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Business Type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                          <SelectItem value="Retail/Commercial">Retail/Commercial</SelectItem>
                          <SelectItem value="Office Building">Office Building</SelectItem>
                          <SelectItem value="Warehouse/Distribution">Warehouse/Distribution</SelectItem>
                          <SelectItem value="Healthcare">Healthcare</SelectItem>
                          <SelectItem value="Education">Education</SelectItem>
                          <SelectItem value="Agriculture">Agriculture</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="business@company.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number (Optional)</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="(604) 555-0123" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Property Details */}
            <div>
              <h3 className="section-header">
                <MapPin className="h-6 w-6" />
                Property Details
              </h3>
              <div className="space-y-6">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="propertyAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Commercial Property Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your BC commercial address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="button" 
                    onClick={handleAddressAnalysis}
                    disabled={addressAnalysisMutation.isPending}
                    className="bg-blue-600 text-white hover:bg-blue-700"
                  >
                    <Satellite className="h-4 w-4 mr-2" />
                    {addressAnalysisMutation.isPending ? "Analyzing..." : "Analyze with Google Solar API"}
                  </Button>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="buildingSquareFootage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Building Square Footage</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="50,000" 
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="availableRoofArea"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Available Roof Area (sq ft)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="25,000" 
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Energy Usage */}
            <div>
              <h3 className="section-header">
                <Zap className="h-6 w-6" />
                Energy Usage
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="monthlyElectricityUsage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monthly Electricity Usage (kWh)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="50,000" 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="monthlyElectricityBill"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Average Monthly Bill (CAD)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="8500" 
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="peakDemand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Peak Demand (kW)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="200" 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="currentRateTier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Rate Tier</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Rate Tier" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {!ratesLoading && Array.isArray(bcRates) && bcRates?.map((rate: any) => (
                            <SelectItem key={rate.id} value={rate.rateTier}>
                              {rate.rateTier}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* System Configuration */}
            <div>
              <h3 className="section-header">
                <Settings className="h-6 w-6" />
                System Configuration
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="desiredSystemSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Desired System Size (kW): {systemSize[0]} kW</FormLabel>
                      <FormControl>
                        <Slider
                          min={20}
                          max={1000}
                          step={10}
                          value={systemSize}
                          onValueChange={(value) => {
                            setSystemSize(value);
                            field.onChange(value[0]);
                          }}
                        />
                      </FormControl>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>20kW</span>
                        <span>1MW</span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="installationType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Installation Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Installation Type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Roof-Mount">Roof-Mount</SelectItem>
                          <SelectItem value="Ground-Mount">Ground-Mount</SelectItem>
                          <SelectItem value="Carport/Canopy">Carport/Canopy</SelectItem>
                          <SelectItem value="Tracker System">Tracker System</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="panelQuality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Panel Quality</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Panel Quality" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Standard Efficiency">Standard Efficiency</SelectItem>
                          <SelectItem value="High Efficiency">High Efficiency</SelectItem>
                          <SelectItem value="Premium Tier 1">Premium Tier 1</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="batteryStorage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Include Battery Storage</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Battery Option" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="No Battery">No Battery</SelectItem>
                          <SelectItem value="50kWh Commercial Battery">50kWh Commercial Battery</SelectItem>
                          <SelectItem value="100kWh Commercial Battery">100kWh Commercial Battery</SelectItem>
                          <SelectItem value="200kWh+ Custom Solution">200kWh+ Custom Solution</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-blue-600 text-white py-4 text-lg font-semibold hover:bg-blue-700"
              disabled={isCalculating || calculationMutation.isPending}
            >
              <Settings className="h-5 w-5 mr-2" />
              {isCalculating || calculationMutation.isPending ? "Calculating..." : "Calculate Solar Solution"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
