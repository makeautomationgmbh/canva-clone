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
import { EstateDetailPanel } from './EstateDetailPanel';

interface OnOfficeConnectionProps {
  onConnectionChange?: (connected: boolean) => void;
}

export const OnOfficeConnection = ({ onConnectionChange }: OnOfficeConnectionProps) => {
  const { loading, connected, testConnection, getEstates, getEstateFiles, getEstateImages } = useOnOfficeAPI();
  const [estates, setEstates] = useState<OnOfficeEstate[]>([]);
  const [estateFiles, setEstateFiles] = useState<Record<string, any[]>>({});
  const [loadingEstates, setLoadingEstates] = useState(false);
  const [testingFiles, setTestingFiles] = useState(false);
  const [showFieldConfig, setShowFieldConfig] = useState(false);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [selectedEstate, setSelectedEstate] = useState<OnOfficeEstate | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

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
      
      // Automatically load files for all estates
      await loadAllEstateFiles(estateData);
    } catch (error) {
      console.error('Failed to load estates:', error);
    } finally {
      setLoadingEstates(false);
    }
  };

  const loadAllEstateFiles = async (estates: OnOfficeEstate[]) => {
    console.log('🔄 Loading images for estates:', estates.map(e => e.elements.Id || e.id));
    
    const filePromises = estates.map(async (estate) => {
      const estateId = estate.elements.Id || estate.id;
      if (!estateId) return;
      
      try {
        console.log(`📸 Loading images for estate ${estateId}`);
        
        // Use the new getEstateImages API that handles the response properly
        const images = await getEstateImages(parseInt(estateId));
        console.log(`📸 Received ${images.length} images for estate ${estateId}:`, images);
        
        setEstateFiles(prev => ({ ...prev, [estateId]: images }));
        
      } catch (error) {
        console.error(`❌ Failed to load images for estate ${estateId}:`, error);
      }
    });
    
    await Promise.all(filePromises);
    console.log('✅ Finished loading all estate images');
  };

  const testEstateFiles = async () => {
    console.log('🔘 Test Estate Files button clicked!');
    console.log('Available estates:', estates.length);
    
    if (estates.length === 0) {
      console.log('❌ No estates available to test files');
      alert('No estates available to test files. Please load estates first.');
      return;
    }
    
    setTestingFiles(true);
    console.log('🔄 Starting files API test...');
    
    try {
      const firstEstate = estates[0];
      const estateId = firstEstate.elements.Id || firstEstate.id;
      
      console.log(`🏠 Testing files API for estate ${estateId}`);
      console.log('Estate object:', firstEstate);
      
      const files = await getEstateFiles(parseInt(estateId));
      console.log(`✅ Direct files API test result:`, files);
      
      alert(`Files API test completed! Check console for details. Found ${Array.isArray(files) ? files.length : 'unknown'} files.`);
      
    } catch (error) {
      console.error('❌ Direct files API test failed:', error);
      alert(`Files API test failed: ${error.message}`);
    } finally {
      setTestingFiles(false);
    }
  };

  const testEstateImages = async () => {
    console.log('🖼️ Test Estate Images button clicked!');
    console.log('Available estates:', estates.length);
    
    if (estates.length === 0) {
      console.log('❌ No estates available to test images');
      alert('No estates available to test images. Please load estates first.');
      return;
    }
    
    setTestingFiles(true);
    console.log('🔄 Starting IMAGES API test...');
    
    try {
      const firstEstate = estates[0];
      const estateId = firstEstate.elements.Id || firstEstate.id;
      
      console.log(`🏠 Testing IMAGES API for estate ${estateId}`);
      console.log('Estate object:', firstEstate);
      
      const images = await getEstateImages(parseInt(estateId));
      console.log(`✅ Direct IMAGES API test result:`, images);
      
      alert(`Images API test completed! Check console for details. Found ${Array.isArray(images) ? images.length : 'unknown'} images.`);
      
    } catch (error) {
      console.error('❌ Direct IMAGES API test failed:', error);
      alert(`Images API test failed: ${error.message}`);
    } finally {
      setTestingFiles(false);
    }
  };

  const handleFieldConfigSave = (fields: string[]) => {
    setSelectedFields(fields);
    setShowFieldConfig(false);
    if (connected) {
      loadEstates(fields);
    }
  };

  const handleEstateClick = (estate: OnOfficeEstate) => {
    setSelectedEstate(estate);
    setIsPanelOpen(true);
  };

  const handlePanelClose = () => {
    setIsPanelOpen(false);
    setSelectedEstate(null);
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
              <div className="p-4 bg-accent rounded-lg border border-accent-foreground/20">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-accent-foreground" />
                  <span className="font-medium">Status</span>
                </div>
                <p className="text-2xl font-bold text-accent-foreground">Aktiv</p>
                <p className="text-sm text-muted-foreground">API Verbindung</p>
              </div>
              <div className="p-4 bg-primary-light rounded-lg border border-primary/20">
                <div className="flex items-center space-x-2 mb-2">
                  <RefreshCw className="h-4 w-4 text-primary" />
                  <span className="font-medium">Letzter Sync</span>
                </div>
                <p className="text-2xl font-bold text-primary">Jetzt</p>
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
                {estates.map((estate, index) => {
                  const estateId = estate.elements.Id || estate.id;
                  const titleImages = estateFiles[estateId]?.filter(file => file.elements?.type === 'Titelbild') || [];
                  
                  return (
                    <div 
                      key={estate.id || index} 
                      className="border border-border/50 rounded-lg p-4 hover:bg-muted/30 transition-colors cursor-pointer"
                      onClick={() => handleEstateClick(estate)}
                    >
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

                    {/* Show only Titelbild */}
                    {titleImages.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-border/20">
                        <div className="relative">
                          <img 
                            src={titleImages[0].elements.imageUrl} 
                            alt={titleImages[0].elements.title || 'Titelbild'}
                            className="w-full h-32 object-cover rounded-lg shadow-card"
                          />
                          <div className="absolute top-2 left-2">
                            <Badge variant="secondary" className="text-xs">
                              Titelbild
                            </Badge>
                          </div>
                          {titleImages[0].elements.title && (
                            <div className="absolute bottom-2 left-2 right-2">
                              <div className="bg-black/70 text-white p-2 rounded text-sm">
                                {titleImages[0].elements.title}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Click hint */}
                        <div className="mt-2 text-xs text-muted-foreground text-center">
                          Klicken Sie für alle Details und Bilder
                        </div>
                      </div>
                    )}

                    {/* No image placeholder */}
                    {titleImages.length === 0 && (
                      <div className="mt-4 pt-3 border-t border-border/20">
                        <div className="w-full h-32 bg-muted rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <ImageIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">Kein Titelbild verfügbar</p>
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground text-center">
                          Klicken Sie für alle Details
                        </div>
                      </div>
                    )}

                    </div>
                  );
                })}
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

      {/* API Test Buttons */}
      {connected && (
        <div className="text-center space-x-2">
          <Button 
            variant="outline" 
            onClick={() => setShowFieldConfig(!showFieldConfig)}
          >
            <Settings className="h-4 w-4 mr-2" />
            {showFieldConfig ? 'Konfiguration schließen' : 'Felder konfigurieren'}
          </Button>
          
          {estates.length > 0 && (
            <>
              <Button 
                variant="outline" 
                onClick={testEstateFiles}
                disabled={testingFiles}
              >
                {testingFiles ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <ImageIcon className="h-4 w-4 mr-2" />
                )}
                {testingFiles ? 'Testing...' : 'Test Files API'}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={testEstateImages}
                disabled={testingFiles}
              >
                {testingFiles ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <ImageIcon className="h-4 w-4 mr-2" />
                )}
                {testingFiles ? 'Testing...' : 'Test Images API (n8n logic)'}
              </Button>
            </>
          )}
        </div>
      )}
      {/* Estate Detail Panel */}
      <EstateDetailPanel
        estate={selectedEstate}
        estateImages={selectedEstate ? estateFiles[selectedEstate.elements.Id || selectedEstate.id] || [] : []}
        isOpen={isPanelOpen}
        onClose={handlePanelClose}
      />
    </div>
  );
};