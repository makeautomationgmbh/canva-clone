import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Building2, Camera, Zap } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-subtle py-24 lg:py-32">
      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-primary font-medium">
                <Building2 className="h-5 w-5" />
                <span>Real Estate Marketing Automation</span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Auto-Generate 
                <span className="gradient-primary bg-clip-text text-transparent"> Social Content</span> 
                for Every Listing
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg">
                Connect your onOffice CRM and automatically create professional social media posts. 
                No graphic designer needed - just beautiful, branded content at scale.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="primary" size="lg" className="shadow-medium">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg">
                Watch Demo
              </Button>
            </div>

            <div className="flex items-center space-x-8 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-primary" />
                <span>Instant Setup</span>
              </div>
              <div className="flex items-center space-x-2">
                <Camera className="h-4 w-4 text-primary" />
                <span>AI-Powered</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <Card className="p-8 shadow-soft">
              <div className="space-y-6">
                <div className="bg-primary-light rounded-lg p-4">
                  <h3 className="font-semibold text-primary mb-2">Template Preview</h3>
                  <div className="bg-background rounded border-2 border-dashed border-primary/30 h-48 flex items-center justify-center">
                    <div className="text-center space-y-2 text-muted-foreground">
                      <Building2 className="h-8 w-8 mx-auto" />
                      <p className="text-sm">Dynamic content from your CRM</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Price:</span>
                    <p className="font-semibold">$450,000</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Location:</span>
                    <p className="font-semibold">Downtown</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};