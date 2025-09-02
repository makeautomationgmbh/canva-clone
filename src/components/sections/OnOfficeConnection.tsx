import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Building2, 
  Zap, 
  CheckCircle, 
  XCircle, 
  Loader2,
  RefreshCw,
  ExternalLink,
  Home,
  Euro,
  MapPin,
  Square
} from 'lucide-react';
import { useOnOfficeAPI, type OnOfficeEstate } from '@/hooks/useOnOfficeAPI';

interface OnOfficeConnectionProps {
  onConnectionChange?: (connected: boolean) => void;
}

export const OnOfficeConnection = ({ onConnectionChange }: OnOfficeConnectionProps) => {
  const { loading, connected, testConnection, getEstates } = useOnOfficeAPI();
  const [estates, setEstates] = useState<OnOfficeEstate[]>([]);
  const [loadingEstates, setLoadingEstates] = useState(false);

  useEffect(() => {
    onConnectionChange?.(connected);
  }, [connected, onConnectionChange]);

  const handleConnect = async () => {
    const success = await testConnection();
    if (success) {
      await loadEstates();
    }
  };

  const loadEstates = async () => {
    try {
      setLoadingEstates(true);
      const estateData = await getEstates({ listlimit: 10 });
      setEstates(estateData);
    } catch (error) {
      console.error('Failed to load estates:', error);
    } finally {
      setLoadingEstates(false);
    }
  };

  const formatPrice = (price: string | undefined) => {
    if (!price) return 'Preis auf Anfrage';
    const numPrice = parseFloat(price);
    if (isNaN(numPrice)) return price;
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numPrice);
  };

  return (
    <div className="space-y-6">
      {/* Connection Status Card */}
      <Card className="border-border/50">
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
            <Badge variant={connected ? "default" : "secondary"} className="flex items-center space-x-1">
              {connected ? (
                <CheckCircle className="h-3 w-3" />
              ) : (
                <XCircle className="h-3 w-3" />
              )}
              <span>{connected ? "Verbunden" : "Nicht verbunden"}</span>
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <p className="font-medium">
                {connected ? "Verbindung aktiv" : "onOffice API konfigurieren"}
              </p>
              <p className="text-sm text-muted-foreground">
                {connected 
                  ? "Ihre onOffice Integration ist aktiv und bereit"
                  : "Testen Sie die Verbindung zu Ihrem onOffice CRM"
                }
              </p>
            </div>
            <div className="flex space-x-2">
              {connected && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={loadEstates}
                  disabled={loadingEstates}
                >
                  {loadingEstates ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  Neu laden
                </Button>
              )}
              <Button 
                variant="primary" 
                onClick={handleConnect}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Zap className="h-4 w-4 mr-2" />
                )}
                {connected ? "Verbindung testen" : "Jetzt verbinden"}
              </Button>
            </div>
          </div>

          {connected && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div className="flex items-center space-x-2 mb-2">
                  <Building2 className="h-4 w-4 text-primary" />
                  <span className="font-medium">Immobilien</span>
                </div>
                <p className="text-2xl font-bold">{estates.length}</p>
                <p className="text-sm text-muted-foreground">Verfügbare Listings</p>
              </div>
              <div className="p-4 bg-green-500/5 rounded-lg border border-green-500/20">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="font-medium">Status</span>
                </div>
                <p className="text-2xl font-bold text-green-600">Aktiv</p>
                <p className="text-sm text-muted-foreground">API Verbindung</p>
              </div>
              <div className="p-4 bg-blue-500/5 rounded-lg border border-blue-500/20">
                <div className="flex items-center space-x-2 mb-2">
                  <RefreshCw className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">Letzter Sync</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">Jetzt</p>
                <p className="text-sm text-muted-foreground">Automatisch</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Estates List */}
      {connected && estates.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Aktuelle Immobilien</CardTitle>
                <CardDescription>
                  Ihre neuesten Listings aus onOffice ({estates.length} gefunden)
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <a href="https://login.onoffice.de" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  onOffice öffnen
                </a>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <div className="space-y-4">
                {estates.map((estate, index) => (
                  <div key={estate.id || index} className="border border-border/50 rounded-lg p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">
                          {estate.elements.objekttitel || `Immobilie #${estate.elements.Id || estate.id}`}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3" />
                            <span>{estate.elements.lage || 'Lage nicht angegeben'}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Home className="h-3 w-3" />
                            <span>{estate.elements.objektart || 'Typ nicht angegeben'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary mb-1">
                          {formatPrice(estate.elements.kaufpreis)}
                        </div>
                        <Badge variant="outline">ID: {estate.elements.Id || estate.id}</Badge>
                      </div>
                    </div>

                    {estate.elements.objektbeschreibung && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {estate.elements.objektbeschreibung}
                      </p>
                    )}

                    <div className="flex items-center space-x-6 text-sm">
                      {estate.elements.wohnflaeche && (
                        <div className="flex items-center space-x-1">
                          <Square className="h-3 w-3 text-muted-foreground" />
                          <span>{estate.elements.wohnflaeche} m²</span>
                        </div>
                      )}
                      {estate.elements.zimmer && (
                        <div className="flex items-center space-x-1">
                          <Home className="h-3 w-3 text-muted-foreground" />
                          <span>{estate.elements.zimmer} Zimmer</span>
                        </div>
                      )}
                      {estate.elements.badezimmer && (
                        <div className="flex items-center space-x-1">
                          <span className="text-muted-foreground">🚿</span>
                          <span>{estate.elements.badezimmer} Bad</span>
                        </div>
                      )}
                      {estate.elements.objektnr_extern && (
                        <div className="flex items-center space-x-1">
                          <span className="text-muted-foreground">📋</span>
                          <span>{estate.elements.objektnr_extern}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};