import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Palette, Bot, Share2, BarChart, Zap } from "lucide-react";

const features = [
  {
    icon: Database,
    title: "onOffice CRM Integration",
    description: "Seamlessly connect your existing CRM and sync listing data in real-time for automatic content generation."
  },
  {
    icon: Palette,
    title: "Visual Template Builder",
    description: "Design beautiful templates with our intuitive editor. Map CRM fields to create dynamic, branded content."
  },
  {
    icon: Bot,
    title: "AI-Powered Captions",
    description: "Generate engaging property descriptions and social media captions tailored to your brand voice."
  },
  {
    icon: Share2,
    title: "Multi-Platform Publishing",
    description: "Export optimized content for Facebook, Instagram, LinkedIn, and other social media platforms."
  },
  {
    icon: BarChart,
    title: "Performance Analytics",
    description: "Track engagement and optimize your content strategy with detailed performance insights."
  },
  {
    icon: Zap,
    title: "Instant Generation",
    description: "Transform listing data into professional social media posts in seconds, not hours."
  }
];

export const Features = () => {
  return (
    <section id="features" className="py-24 lg:py-32">
      <div className="container">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold">
            Everything You Need to Scale Your 
            <span className="gradient-primary bg-clip-text text-transparent"> Social Presence</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From CRM integration to AI-powered content generation, we've built the complete solution 
            for modern real estate marketing.
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