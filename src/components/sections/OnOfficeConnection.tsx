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
  Square,
  Settings,
  Image as ImageIcon,
  Download
} from 'lucide-react';
import { useOnOfficeAPI, type OnOfficeEstate } from '@/hooks/useOnOfficeAPI';
import { OnOfficeFieldConfig } from './OnOfficeFieldConfig';
import { OnOfficeDataDebugger } from './OnOfficeDataDebugger';

interface OnOfficeConnectionProps {
  onConnectionChange?: (connected: boolean) => void;
}

export const OnOfficeConnection = ({ onConnectionChange }: OnOfficeConnectionProps) => {
  const { loading, connected, testConnection, getEstates, getEstateFiles } = useOnOfficeAPI();
  const [estates, setEstates] = useState<OnOfficeEstate[]>([]);
  const [estateFiles, setEstateFiles] = useState<Record<string, any[]>>({});
  const [loadingEstates, setLoadingEstates] = useState(false);
  const [loadingFiles, setLoadingFiles] = useState<Record<string, boolean>>({});
  const [showFieldConfig, setShowFieldConfig] = useState(false);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);

  useEffect(() => {
    onConnectionChange?.(connected);
  }, [connected, onConnectionChange]);

  const handleConnect = async () => {
    const success = await testConnection();
    if (success) {
      await loadEstates();
    }
  };

  const loadEstates = async (customFields?: string[]) => {
    try {
      setLoadingEstates(true);
      const parameters: any = { listlimit: 10 };
      
      // If custom fields are provided, use them
      if (customFields && customFields.length > 0) {
        parameters.data = customFields;
      }
      
      const estateData = await getEstates(parameters);
      console.log('Estate data received:', estateData);
      
      // Log the first estate's elements to see available fields
      if (estateData.length > 0) {
        console.log('First estate elements:', estateData[0].elements);
        console.log('Available field names:', Object.keys(estateData[0].elements || {}));
      }
      
      setEstates(estateData);
    } catch (error) {
      console.error('Failed to load estates:', error);
    } finally {
      setLoadingEstates(false);
    }
  };

  const handleFieldConfigSave = (fields: string[]) => {
    setSelectedFields(fields);
    setShowFieldConfig(false);
    if (connected) {
      loadEstates(fields);
    }
  };

  const loadEstateFiles = async (estateId: string) => {
    if (loadingFiles[estateId] || estateFiles[estateId]) return; // Don't load if already loading or loaded
    
    try {
      setLoadingFiles(prev => ({ ...prev, [estateId]: true }));
      const files = await getEstateFiles(parseInt(estateId));
      console.log(`Files for estate ${estateId}:`, files);
      setEstateFiles(prev => ({ ...prev, [estateId]: files }));
    } catch (error) {
      console.error(`Failed to load files for estate ${estateId}:`, error);
    } finally {
      setLoadingFiles(prev => ({ ...prev, [estateId]: false }));
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
                  onClick={() => loadEstates()}
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
                          {estate.elements.objekttitel || `Immobilie #${estate.elements.id || estate.id}`}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3" />
                            <span>{estate.elements.lage || estate.elements.ort || estate.elements.plz || 'Lage nicht angegeben'}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Home className="h-3 w-3" />
                            <span>{estate.elements.objektart || estate.elements.vermarktungsart || 'Typ nicht angegeben'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary mb-1">
                          {formatPrice(estate.elements.kaufpreis || estate.elements.kaltmiete)}
                        </div>
                        <Badge variant="outline">ID: {estate.elements.id || estate.id}</Badge>
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

                    {/* Estate Images Section */}
                    <div className="mt-4 pt-3 border-t border-border/20">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-medium flex items-center space-x-2">
                          <ImageIcon className="h-4 w-4" />
                          <span>Bilder</span>
                        </h4>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => loadEstateFiles(estate.elements.Id || estate.id)}
                          disabled={loadingFiles[estate.elements.Id || estate.id]}
                        >
                          {loadingFiles[estate.elements.Id || estate.id] ? (
                            <Loader2 className="h-3 w-3 animate-spin mr-1" />
                          ) : (
                            <Download className="h-3 w-3 mr-1" />
                          )}
                          Bilder laden
                        </Button>
                      </div>
                      
                      {estateFiles[estate.elements.Id || estate.id] && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {estateFiles[estate.elements.Id || estate.id].slice(0, 6).map((file, fileIndex) => (
                            <div key={fileIndex} className="relative group">
                              {file.url ? (
                                <img 
                                  src={file.url} 
                                  alt={file.title || file.name || `Bild ${fileIndex + 1}`}
                                  className="w-full h-20 object-cover rounded border border-border/20 hover:scale-105 transition-transform cursor-pointer"
                                  onClick={() => window.open(file.url, '_blank')}
                                />
                              ) : (
                                <div className="w-full h-20 bg-muted rounded border border-border/20 flex items-center justify-center">
                                  <ImageIcon className="h-6 w-6 text-muted-foreground" />
                                </div>
                              )}
                              {file.title && (
                                <div className="absolute inset-0 bg-black/70 text-white p-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-end">
                                  <span className="truncate">{file.title}</span>
                                </div>
                              )}
                            </div>
                          ))}
                          {estateFiles[estate.elements.Id || estate.id].length > 6 && (
                            <div className="w-full h-20 bg-muted rounded border border-border/20 flex items-center justify-center text-sm text-muted-foreground">
                              +{estateFiles[estate.elements.Id || estate.id].length - 6} weitere
                            </div>
                          )}
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

      {/* Field Configuration */}
      {connected && showFieldConfig && (
        <OnOfficeFieldConfig onSave={handleFieldConfigSave} />
      )}

      {/* Data Debugger */}
      {connected && estates.length > 0 && (
        <OnOfficeDataDebugger estates={estates} />
      )}

      {/* Toggle Field Config Button */}
      {connected && (
        <div className="text-center">
          <Button 
            variant="outline" 
            onClick={() => setShowFieldConfig(!showFieldConfig)}
          >
            <Settings className="h-4 w-4 mr-2" />
            {showFieldConfig ? 'Konfiguration schließen' : 'Felder konfigurieren'}
          </Button>
        </div>
      )}
    </div>
  );
};