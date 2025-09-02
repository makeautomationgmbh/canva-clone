import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, CheckCircle } from "lucide-react";

const benefits = [
  "Connect your onOffice CRM in minutes",
  "AI-powered content generation", 
  "Unlimited template customization",
  "Multi-platform publishing",
  "Professional support included"
];

export const CTA = () => {
  return (
    <section className="py-24 lg:py-32">
      <div className="container">
        <Card className="gradient-hero text-primary-foreground p-12 lg:p-16 text-center shadow-medium">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl lg:text-4xl font-bold">
                Ready to Transform Your Real Estate Marketing?
              </h2>
              <p className="text-xl opacity-90">
                Join hundreds of real estate professionals who've automated their social media content creation
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="space-y-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 flex-shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-6">
                <div className="text-center md:text-left">
                  <div className="text-3xl font-bold">Start Free</div>
                  <div className="opacity-90">14-day trial, no credit card required</div>
                </div>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                >
                  Start Your Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};