import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Code, Copy, Eye } from 'lucide-react';
import { OnOfficeEstate } from '@/hooks/useOnOfficeAPI';

interface DataDebuggerProps {
  estates: OnOfficeEstate[];
}

export const OnOfficeDataDebugger = ({ estates }: DataDebuggerProps) => {
  const [selectedEstate, setSelectedEstate] = useState<OnOfficeEstate | null>(null);
  
  if (estates.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Code className="h-5 w-5" />
            <span>Daten Debugger</span>
          </CardTitle>
          <CardDescription>Keine Immobiliendaten zum Analysieren verfügbar</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const allFieldNames = new Set<string>();
  estates.forEach(estate => {
    if (estate.elements) {
      Object.keys(estate.elements).forEach(key => allFieldNames.add(key));
    }
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Code className="h-5 w-5" />
          <span>onOffice Daten Debugger</span>
        </CardTitle>
        <CardDescription>
          Analysieren Sie die verfügbaren Feldnamen in Ihren onOffice Daten
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Available Field Names */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Verfügbare Feldnamen ({allFieldNames.size})</h3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => copyToClipboard(Array.from(allFieldNames).join('\n'))}
            >
              <Copy className="h-4 w-4 mr-2" />
              Kopieren
            </Button>
          </div>
          <ScrollArea className="h-48 border border-border rounded-lg p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {Array.from(allFieldNames).sort().map((fieldName) => (
                <Badge key={fieldName} variant="outline" className="text-xs">
                  {fieldName}
                </Badge>
              ))}
            </div>
          </ScrollArea>
        </div>

        <Separator />

        {/* Estate Selector */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Immobilie Details ansehen</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {estates.slice(0, 5).map((estate, index) => (
              <Button
                key={estate.id || index}
                variant={selectedEstate?.id === estate.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedEstate(estate)}
              >
                <Eye className="h-4 w-4 mr-2" />
                ID: {estate.id || index + 1}
              </Button>
            ))}
          </div>
        </div>

        {/* Selected Estate Data */}
        {selectedEstate && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold">Daten für Immobilie ID: {selectedEstate.id}</h4>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => copyToClipboard(JSON.stringify(selectedEstate.elements, null, 2))}
              >
                <Copy className="h-4 w-4 mr-2" />
                JSON kopieren
              </Button>
            </div>
            
            <ScrollArea className="h-64 border border-border rounded-lg p-4">
              <div className="space-y-2">
                {Object.entries(selectedEstate.elements || {}).map(([key, value]) => (
                  <div key={key} className="flex items-start justify-between py-1 border-b border-border/50">
                    <span className="font-mono text-sm font-semibold text-primary min-w-0 flex-1">
                      {key}:
                    </span>
                    <span className="text-sm text-muted-foreground ml-4 break-all">
                      {value !== null && value !== undefined ? String(value) : 'null'}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
          <h4 className="font-medium mb-2 text-blue-900 dark:text-blue-100">
            💡 So verwenden Sie diese Informationen:
          </h4>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>1. Schauen Sie sich die verfügbaren Feldnamen oben an</li>
            <li>2. Wählen Sie eine Immobilie aus, um deren Daten zu sehen</li>
            <li>3. Notieren Sie sich die Feldnamen, die Sie für Ihre Templates benötigen</li>
            <li>4. Verwenden Sie diese Namen in der Feldkonfiguration</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};