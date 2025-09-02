import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, Eye, Download, Settings } from "lucide-react";

const templates = [
  {
    id: 1,
    name: "Moderne Immobilien-Karte",
    category: "Instagram",
    status: "Aktiv",
    usage: 24,
    lastUsed: "vor 2 Stunden",
  },
  {
    id: 2,
    name: "Immobilien-Showcase",
    category: "Facebook",
    status: "Aktiv", 
    usage: 18,
    lastUsed: "vor 1 Tag",
  },
  {
    id: 3,
    name: "Tag der offenen Tür",
    category: "LinkedIn",
    status: "Entwurf",
    usage: 0,
    lastUsed: "Nie",
  },
];

export const Dashboard = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Vorlagen Dashboard</h2>
              <p className="text-muted-foreground">Verwalten Sie Ihre Social Media Vorlagen und generieren Sie Inhalte</p>
            </div>
            <Button variant="primary" onClick={() => window.location.href = '/template-editor'}>
              <Plus className="h-4 w-4 mr-2" />
              Neue Vorlage
            </Button>
          </div>

          <div className="grid gap-6">
            {templates.map((template) => (
              <Card key={template.id} className="shadow-card hover:shadow-soft transition-smooth">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant={template.status === "Aktiv" ? "default" : "secondary"}>
                            {template.status}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{template.category}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{template.usage} mal verwendet</span>
                    <span>Zuletzt verwendet {template.lastUsed}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};