import { useAuth } from '@/hooks/useAuth';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Plus, 
  Settings, 
  BarChart3, 
  FileImage, 
  Zap,
  Users,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { useState } from 'react';

export default function Dashboard() {
  const { user } = useAuth();
  const [connectedToOnOffice, setConnectedToOnOffice] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Willkommen zurück!
          </h1>
          <p className="text-muted-foreground">
            Erstellen Sie automatisch professionelle Social Media Inhalte aus Ihren onOffice Immobiliendaten.
          </p>
        </div>

        {/* onOffice Connection Status */}
        <Card className="mb-8 border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>onOffice Integration</CardTitle>
                  <CardDescription>
                    Verbinden Sie Ihr onOffice CRM für automatische Datenimporte
                  </CardDescription>
                </div>
              </div>
              <Badge variant={connectedToOnOffice ? "default" : "secondary"}>
                {connectedToOnOffice ? "Verbunden" : "Nicht verbunden"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {!connectedToOnOffice ? (
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">onOffice API konfigurieren</p>
                  <p className="text-sm text-muted-foreground">
                    Verbinden Sie Ihr onOffice CRM um Immobiliendaten zu importieren
                  </p>
                </div>
                <Button variant="primary">
                  <Zap className="h-4 w-4 mr-2" />
                  Jetzt verbinden
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="flex items-center space-x-2 mb-2">
                    <Building2 className="h-4 w-4 text-primary" />
                    <span className="font-medium">Immobilien</span>
                  </div>
                  <p className="text-2xl font-bold">24</p>
                  <p className="text-sm text-muted-foreground">Aktive Listings</p>
                </div>
                <div className="p-4 bg-green-500/5 rounded-lg border border-green-500/20">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="font-medium">Sync Status</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600">100%</p>
                  <p className="text-sm text-muted-foreground">Letzte Sync: vor 2 Min</p>
                </div>
                <div className="p-4 bg-blue-500/5 rounded-lg border border-blue-500/20">
                  <div className="flex items-center space-x-2 mb-2">
                    <FileImage className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">Generierte Posts</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">156</p>
                  <p className="text-sm text-muted-foreground">Diesen Monat</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="templates" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="templates">Vorlagen</TabsTrigger>
            <TabsTrigger value="listings">Immobilien</TabsTrigger>
            <TabsTrigger value="generated">Generierte Posts</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Template Bibliothek</h2>
                <p className="text-muted-foreground">
                  Erstellen und verwalten Sie Ihre Social Media Vorlagen
                </p>
              </div>
              <Button variant="primary">
                <Plus className="h-4 w-4 mr-2" />
                Neue Vorlage
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Template Cards */}
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Standard Listing</CardTitle>
                    <Badge variant="secondary">Aktiv</Badge>
                  </div>
                  <CardDescription>
                    Klassische Immobilienpräsentation mit Bild und Details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center mb-4">
                    <FileImage className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Verwendet: 23x</span>
                    <span>Zuletzt: vor 2 Std</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Instagram Story</CardTitle>
                    <Badge variant="secondary">Aktiv</Badge>
                  </div>
                  <CardDescription>
                    Vertikales Format für Instagram und Facebook Stories
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-[9/16] bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg flex items-center justify-center mb-4 max-h-32">
                    <FileImage className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Verwendet: 45x</span>
                    <span>Zuletzt: vor 1 Tag</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer border-dashed border-2 border-muted-foreground/20">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Plus className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground font-medium">Neue Vorlage erstellen</p>
                  <p className="text-sm text-muted-foreground/70 text-center mt-2">
                    Klicken Sie hier um eine neue Social Media Vorlage zu erstellen
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Listings Tab */}
          <TabsContent value="listings" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Immobilien Übersicht</h2>
                <p className="text-muted-foreground">
                  Ihre aktuellen Listings aus onOffice
                </p>
              </div>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                onOffice Einstellungen
              </Button>
            </div>

            {!connectedToOnOffice ? (
              <Card className="p-12 text-center">
                <Building2 className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">onOffice nicht verbunden</h3>
                <p className="text-muted-foreground mb-6">
                  Verbinden Sie Ihr onOffice CRM um Ihre Immobilien hier zu sehen
                </p>
                <Button variant="primary">onOffice verbinden</Button>
              </Card>
            ) : (
              <div className="space-y-4">
                {/* Listing items would be rendered here */}
                <p className="text-muted-foreground">Immobilien werden hier angezeigt...</p>
              </div>
            )}
          </TabsContent>

          {/* Generated Posts Tab */}
          <TabsContent value="generated" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Generierte Posts</h2>
                <p className="text-muted-foreground">
                  Ihre automatisch erstellten Social Media Inhalte
                </p>
              </div>
            </div>

            <Card className="p-12 text-center">
              <FileImage className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Noch keine Posts generiert</h3>
              <p className="text-muted-foreground mb-6">
                Erstellen Sie Ihre erste Vorlage um automatisch Posts zu generieren
              </p>
              <Button variant="primary">Erste Vorlage erstellen</Button>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Analytics</h2>
                <p className="text-muted-foreground">
                  Statistiken zu Ihren generierten Inhalten
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Generierte Posts</CardTitle>
                  <FileImage className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">156</div>
                  <p className="text-xs text-muted-foreground">+20% vs. letzter Monat</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Aktive Vorlagen</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8</div>
                  <p className="text-xs text-muted-foreground">+2 diese Woche</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sync Frequenz</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24/Tag</div>
                  <p className="text-xs text-muted-foreground">Automatische Updates</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Performance</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">98.5%</div>
                  <p className="text-xs text-muted-foreground">Erfolgsrate</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}