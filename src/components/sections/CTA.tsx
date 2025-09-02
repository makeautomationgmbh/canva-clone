import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, CheckCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const benefits = [
  "Verbinden Sie Ihr onOffice CRM in wenigen Minuten",
  "KI-gestützte Inhaltserstellung", 
  "Unbegrenzte Vorlagen-Anpassung",
  "Multi-Plattform Veröffentlichung",
  "Professioneller Support inklusive"
];

export const CTA = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <section className="py-24 lg:py-32">
      <div className="container">
        <Card className="gradient-hero text-primary-foreground p-12 lg:p-16 text-center shadow-medium">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl lg:text-4xl font-bold">
                Bereit, Ihr Immobilienmarketing zu revolutionieren?
              </h2>
              <p className="text-xl opacity-90">
                Schließen Sie sich Hunderten von Immobilienprofis an, die ihre Social Media Inhaltserstellung automatisiert haben
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
                  <div className="text-3xl font-bold">Kostenlos starten</div>
                  <div className="opacity-90">14 Tage kostenlos testen, keine Kreditkarte erforderlich</div>
                </div>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                  onClick={() => navigate(user ? '/dashboard' : '/auth')}
                >
                  {user ? 'Zum Dashboard' : 'Jetzt kostenlos testen'}
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