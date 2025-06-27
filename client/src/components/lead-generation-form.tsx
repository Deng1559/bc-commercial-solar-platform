import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Mail, Phone, Building, MapPin, Zap } from "lucide-react";

const leadSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  businessName: z.string().min(1, "Business name is required"),
  businessType: z.string().min(1, "Business type is required"),
  address: z.string().min(1, "Business address is required"),
  monthlyElectricityBill: z.number().min(500, "Monthly bill must be at least $500"),
  roofArea: z.number().min(1000, "Roof area must be at least 1,000 sq ft"),
  timeframe: z.string().min(1, "Timeframe is required"),
  primaryGoal: z.string().min(1, "Primary goal is required"),
  additionalNotes: z.string().optional(),
});

type LeadFormData = z.infer<typeof leadSchema>;

interface LeadGenerationFormProps {
  onLeadSubmitted?: (leadData: LeadFormData) => void;
}

export default function LeadGenerationForm({ onLeadSubmitted }: LeadGenerationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      businessName: "",
      businessType: "",
      address: "",
      monthlyElectricityBill: 2500,
      roofArea: 15000,
      timeframe: "",
      primaryGoal: "",
      additionalNotes: "",
    },
  });

  // Lead submission mutation
  const leadMutation = useMutation({
    mutationFn: async (data: LeadFormData) => {
      const response = await apiRequest("POST", "/api/leads", data);
      return response.json();
    },
    onSuccess: (data, variables) => {
      toast({
        title: "Thank You!",
        description: "Your inquiry has been submitted. A solar specialist will contact you within 24 hours.",
      });
      onLeadSubmitted?.(variables);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Submission Failed",
        description: "Unable to submit your inquiry. Please try again or call us directly.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LeadFormData) => {
    setIsSubmitting(true);
    leadMutation.mutate(data);
    setIsSubmitting(false);
  };

  const businessTypes = [
    "Manufacturing",
    "Retail/Commercial",
    "Office Building",
    "Warehouse/Distribution",
    "Healthcare",
    "Education",
    "Agriculture",
    "Technology/Data Center",
    "Hospitality",
    "Automotive",
    "Other",
  ];

  const timeframes = [
    "Immediate (0-3 months)",
    "Near-term (3-6 months)",
    "Mid-term (6-12 months)",
    "Long-term (12+ months)",
    "Just exploring options",
  ];

  const primaryGoals = [
    "Reduce operating costs",
    "Environmental sustainability",
    "Energy independence",
    "Tax benefits/incentives",
    "Corporate ESG goals",
    "Hedge against rate increases",
    "Property value enhancement",
    "Other",
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Go Solar? Get Your Custom Proposal
          </h2>
          <p className="text-xl text-blue-100">
            Connect with BC's leading commercial solar specialists. Get a detailed proposal 
            customized for your business needs and take advantage of 2025's unprecedented incentives.
          </p>
        </div>

        <Card className="bg-white text-gray-900 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center flex items-center justify-center">
              <Zap className="h-6 w-6 mr-2 text-blue-600" />
              Get Your Free Solar Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Mail className="h-5 w-5 mr-2 text-blue-600" />
                    Contact Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Smith" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Email *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john@company.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number *</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="(604) 555-0123" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Business Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Building className="h-5 w-5 mr-2 text-blue-600" />
                    Business Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="businessName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="ABC Manufacturing Ltd." {...field} />
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
                          <FormLabel>Business Type *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Business Type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {businessTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="md:col-span-2">
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Business Address *</FormLabel>
                            <FormControl>
                              <Input placeholder="123 Industrial Way, Vancouver, BC" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* Energy Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-blue-600" />
                    Energy & Property Details
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="monthlyElectricityBill"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Monthly Electricity Bill (CAD) *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="2500"
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
                      name="roofArea"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Available Roof Area (sq ft) *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="15000"
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

                {/* Project Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                    Project Details
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="timeframe"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Timeframe *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Timeframe" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {timeframes.map((timeframe) => (
                                <SelectItem key={timeframe} value={timeframe}>
                                  {timeframe}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="primaryGoal"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Primary Goal *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Primary Goal" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {primaryGoals.map((goal) => (
                                <SelectItem key={goal} value={goal}>
                                  {goal}
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

                {/* Additional Notes */}
                <FormField
                  control={form.control}
                  name="additionalNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us about any specific requirements, questions, or additional information about your business..."
                          className="resize-none"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-green-600 text-white py-4 text-lg font-semibold hover:bg-green-700"
                  disabled={isSubmitting || leadMutation.isPending}
                >
                  {isSubmitting || leadMutation.isPending ? "Submitting..." : "Get My Free Solar Proposal"}
                </Button>

                <p className="text-sm text-gray-600 text-center">
                  By submitting this form, you consent to be contacted by our solar specialists. 
                  We respect your privacy and will never share your information.
                </p>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}