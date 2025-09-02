import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Settings, Plus, X, Save } from 'lucide-react';

interface FieldConfig {
  name: string;
  enabled: boolean;
  custom?: boolean;
}

interface OnOfficeFieldConfigProps {
  onSave?: (fields: string[]) => void;
}

export const OnOfficeFieldConfig = ({ onSave }: OnOfficeFieldConfigProps) => {
  // Standard basic fields that most onOffice systems have
  const [standardFields, setStandardFields] = useState<FieldConfig[]>([
    { name: 'id', enabled: true },
    { name: 'objektnr_extern', enabled: true },
    { name: 'objektnr_intern', enabled: false },
    { name: 'status', enabled: true },
    { name: 'kaufpreis', enabled: true },
    { name: 'kaltmiete', enabled: true },
    { name: 'warmmiete', enabled: false },
    { name: 'nebenkosten', enabled: false },
    { name: 'objekttitel', enabled: true },
    { name: 'objektbeschreibung', enabled: true },
    { name: 'objektart', enabled: true },
    { name: 'vermarktungsart', enabled: true },
    { name: 'nutzungsart', enabled: false },
    { name: 'wohnflaeche', enabled: true },
    { name: 'nutzflaeche', enabled: false },
    { name: 'grundstueck', enabled: true },
    { name: 'zimmer', enabled: true },
    { name: 'schlafzimmer', enabled: false },
    { name: 'badezimmer', enabled: true },
    { name: 'etage', enabled: false },
    { name: 'anzahl_etagen', enabled: false },
    { name: 'baujahr', enabled: true },
    { name: 'lage', enabled: true },
    { name: 'plz', enabled: true },
    { name: 'ort', enabled: true },
    { name: 'strasse', enabled: false },
    { name: 'hausnummer', enabled: false },
    { name: 'bundesland', enabled: false },
    { name: 'land', enabled: false },
    { name: 'erstellt_am', enabled: true },
    { name: 'geaendert_am', enabled: false }
  ]);

  const [customFields, setCustomFields] = useState<FieldConfig[]>([]);
  const [newFieldName, setNewFieldName] = useState('');

  const toggleStandardField = (fieldName: string) => {
    setStandardFields(prev => 
      prev.map(field => 
        field.name === fieldName 
          ? { ...field, enabled: !field.enabled }
          : field
      )
    );
  };

  const addCustomField = () => {
    if (newFieldName.trim() && !customFields.find(f => f.name === newFieldName.trim())) {
      setCustomFields(prev => [...prev, { 
        name: newFieldName.trim(), 
        enabled: true, 
        custom: true 
      }]);
      setNewFieldName('');
    }
  };

  const removeCustomField = (fieldName: string) => {
    setCustomFields(prev => prev.filter(field => field.name !== fieldName));
  };

  const toggleCustomField = (fieldName: string) => {
    setCustomFields(prev => 
      prev.map(field => 
        field.name === fieldName 
          ? { ...field, enabled: !field.enabled }
          : field
      )
    );
  };

  const handleSave = () => {
    const enabledFields = [
      ...standardFields.filter(f => f.enabled).map(f => f.name),
      ...customFields.filter(f => f.enabled).map(f => f.name)
    ];
    onSave?.(enabledFields);
  };

  const enabledCount = standardFields.filter(f => f.enabled).length + customFields.filter(f => f.enabled).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>onOffice Felder Konfiguration</span>
            </CardTitle>
            <CardDescription>
              Wählen Sie die Immobilienfelder aus, die von der onOffice API abgerufen werden sollen
            </CardDescription>
          </div>
          <Badge variant="outline">
            {enabledCount} Felder ausgewählt
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Standard Fields */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Standard Felder</h3>
          <ScrollArea className="h-64 border border-border rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {standardFields.map((field) => (
                <div key={field.name} className="flex items-center space-x-2">
                  <Checkbox
                    id={field.name}
                    checked={field.enabled}
                    onCheckedChange={() => toggleStandardField(field.name)}
                  />
                  <Label
                    htmlFor={field.name}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {field.name}
                  </Label>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <Separator />

        {/* Custom Fields */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Benutzerdefinierte Felder</h3>
          
          {/* Add New Field */}
          <div className="flex space-x-2 mb-4">
            <Input
              placeholder="Feldname eingeben (z.B. mein_custom_feld)"
              value={newFieldName}
              onChange={(e) => setNewFieldName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCustomField()}
            />
            <Button onClick={addCustomField} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Custom Fields List */}
          {customFields.length > 0 ? (
            <ScrollArea className="h-32 border border-border rounded-lg p-4">
              <div className="space-y-2">
                {customFields.map((field) => (
                  <div key={field.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`custom-${field.name}`}
                        checked={field.enabled}
                        onCheckedChange={() => toggleCustomField(field.name)}
                      />
                      <Label
                        htmlFor={`custom-${field.name}`}
                        className="text-sm font-medium"
                      >
                        {field.name}
                      </Label>
                      <Badge variant="secondary" className="text-xs">Custom</Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCustomField(field.name)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>Keine benutzerdefinierten Felder hinzugefügt</p>
              <p className="text-sm">Fügen Sie Felder hinzu, die spezifisch für Ihr onOffice System sind</p>
            </div>
          )}
        </div>

        <Separator />

        {/* Field Description */}
        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">📝 Hinweise zur Feldkonfiguration</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Standard Felder sind die häufigsten onOffice Immobilienfelder</li>
            <li>• Benutzerdefinierte Felder sind spezifisch für Ihr onOffice System</li>
            <li>• Nicht alle Felder sind in jedem onOffice System verfügbar</li>
            <li>• Feldnamen müssen exakt wie in onOffice geschrieben werden</li>
          </ul>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} className="flex items-center space-x-2">
            <Save className="h-4 w-4" />
            <span>Konfiguration speichern</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};