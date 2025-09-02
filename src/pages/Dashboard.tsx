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
import { useState, useEffect } from 'react';
import { OnOfficeConnection } from '@/components/sections/OnOfficeConnection';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [connectedToOnOffice, setConnectedToOnOffice] = useState(false);
  const [templates, setTemplates] = useState<any[]>([]);

  useEffect(() => {
    loadTemplates();
  }, [user]);

  const loadTemplates = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .order('updated_at', { ascending: false });
    
    if (!error && data) {
      setTemplates(data);
    }
  };

  const deleteTemplate = async (templateId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('templates')
      .delete()
      .eq('id', templateId);

    if (!error) {
      loadTemplates(); // Refresh the list
    }
  };

  const loadTemplate = (templateId: string) => {
    navigate(`/template-editor?template=${templateId}`);
  };

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
        <OnOfficeConnection onConnectionChange={setConnectedToOnOffice} />

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
              <Button variant="primary" onClick={() => navigate('/template-editor')}>
                <Plus className="h-4 w-4 mr-2" />
                Neue Vorlage
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Real Templates from Database */}
              {templates.map((template) => (
                <Card key={template.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <Badge variant="secondary">Aktiv</Badge>
                    </div>
                    <CardDescription>
                      Canvas-Größe: {template.canvas_size?.name || 'Unbekannt'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center mb-4">
                      <FileImage className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                      <span>Erstellt: {new Date(template.created_at).toLocaleDateString()}</span>
                      <span>Layers: {template.layers?.length || 0}</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => loadTemplate(template.id)}
                        className="flex-1"
                      >
                        <Settings className="h-4 w-4 mr-1" />
                        Bearbeiten
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteTemplate(template.id);
                        }}
                      >
                        <FileImage className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Create New Template Card */}
              <Card 
                className="hover:shadow-md transition-shadow cursor-pointer border-dashed border-2 border-muted-foreground/20"
                onClick={() => navigate('/template-editor')}
              >
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Plus className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground font-medium">Neue Vorlage erstellen</p>
                  <p className="text-sm text-muted-foreground/70 text-center mt-2">
                    Klicken Sie hier um eine neue Social Media Vorlage zu erstellen
                  </p>
                </CardContent>
              </Card>

              {/* Show message if no templates */}
              {templates.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <FileImage className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Noch keine Vorlagen</h3>
                  <p className="text-muted-foreground mb-6">
                    Erstellen Sie Ihre erste Vorlage um loszulegen
                  </p>
                  <Button variant="primary" onClick={() => navigate('/template-editor')}>
                    Erste Vorlage erstellen
                  </Button>
                </div>
              )}
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
              <Button variant="primary" onClick={() => navigate('/template-editor')}>Erste Vorlage erstellen</Button>
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