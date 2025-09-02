import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Building2, Camera, Zap } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

export const Hero = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-gradient-subtle py-24 lg:py-32">
      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-primary font-medium">
                <Building2 className="h-5 w-5" />
                <span>Immobilien Marketing Automatisierung</span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Automatische 
                <span className="gradient-primary bg-clip-text text-transparent"> Social Media Inhalte</span> 
                für jede Immobilie
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg">
                Verbinden Sie Ihr onOffice CRM und erstellen Sie automatisch professionelle Social Media Posts. 
                Kein Grafikdesigner nötig - nur schöne, markengerechte Inhalte im großen Stil.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="primary" 
                size="lg" 
                className="shadow-medium"
                onClick={() => navigate(user ? '/dashboard' : '/auth')}
              >
                {user ? 'Zum Dashboard' : 'Kostenlos testen'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg">
                Demo ansehen
              </Button>
            </div>

            <div className="flex items-center space-x-8 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-primary" />
                <span>Sofort einsatzbereit</span>
              </div>
              <div className="flex items-center space-x-2">
                <Camera className="h-4 w-4 text-primary" />
                <span>KI-gestützt</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <Card className="p-8 shadow-soft">
              <div className="space-y-6">
                <div className="bg-primary-light rounded-lg p-4">
                  <h3 className="font-semibold text-primary mb-2">Vorlage Vorschau</h3>
                  <div className="bg-background rounded border-2 border-dashed border-primary/30 h-48 flex items-center justify-center">
                    <div className="text-center space-y-2 text-muted-foreground">
                      <Building2 className="h-8 w-8 mx-auto" />
                      <p className="text-sm">Dynamische Inhalte aus Ihrem CRM</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Preis:</span>
                    <p className="font-semibold">450.000€</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Lage:</span>
                    <p className="font-semibold">Innenstadt</p>
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