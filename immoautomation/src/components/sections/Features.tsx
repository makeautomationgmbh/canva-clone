import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Palette, Bot, Share2, BarChart, Zap } from "lucide-react";

const features = [
  {
    icon: Database,
    title: "onOffice CRM Integration",
    description: "Verbinden Sie nahtlos Ihr bestehendes CRM und synchronisieren Sie Immobiliendaten in Echtzeit für automatische Inhaltserstellung."
  },
  {
    icon: Palette,
    title: "Visueller Vorlagen-Editor",
    description: "Gestalten Sie schöne Vorlagen mit unserem intuitiven Editor. Verknüpfen Sie CRM-Felder für dynamische, markengerechte Inhalte."
  },
  {
    icon: Bot,
    title: "KI-gestützte Texterstellung",
    description: "Generieren Sie ansprechende Immobilienbeschreibungen und Social Media Texte, die zu Ihrer Marke passen."
  },
  {
    icon: Share2,
    title: "Multi-Plattform Veröffentlichung",
    description: "Exportieren Sie optimierte Inhalte für Facebook, Instagram, LinkedIn und andere Social Media Plattformen."
  },
  {
    icon: BarChart,
    title: "Performance Analytics",
    description: "Verfolgen Sie Engagement und optimieren Sie Ihre Content-Strategie mit detaillierten Performance-Einblicken."
  },
  {
    icon: Zap,
    title: "Sofortige Generierung",
    description: "Verwandeln Sie Immobiliendaten in Sekunden, nicht Stunden, in professionelle Social Media Posts."
  }
];

export const Features = () => {
  return (
    <section id="features" className="py-24 lg:py-32">
      <div className="container">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold">
            Alles was Sie brauchen für Ihre 
            <span className="gradient-primary bg-clip-text text-transparent"> Social Media Präsenz</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Von der CRM-Integration bis zur KI-gestützten Inhaltserstellung - wir haben die komplette Lösung 
            für modernes Immobilienmarketing entwickelt.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="shadow-card hover:shadow-soft transition-smooth">
              <CardHeader>
                <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};