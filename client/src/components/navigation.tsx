import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calculator, BarChart3, Building } from "lucide-react";

export default function Navigation() {
  const [location] = useLocation();

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Building className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">BC Solar Pro</span>
            <Badge variant="outline" className="text-xs">
              Commercial
            </Badge>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Link href="/">
            <Button 
              variant={location === "/" ? "default" : "ghost"} 
              size="sm"
              className="flex items-center space-x-2"
            >
              <Calculator className="h-4 w-4" />
              <span>Calculator</span>
            </Button>
          </Link>

          <Link href="/admin">
            <Button 
              variant={location === "/admin" ? "default" : "ghost"} 
              size="sm"
              className="flex items-center space-x-2"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Admin Dashboard</span>
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}