import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, Textbox, FabricImage, Rect } from "fabric";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Type, 
  Image as ImageIcon, 
  Square, 
  Trash2, 
  Save, 
  Download,
  Settings,
  Palette
} from "lucide-react";
import { toast } from "sonner";

interface TemplateLayer {
  id: string;
  type: 'text' | 'image' | 'shape';
  name: string;
  dataBinding?: string; // e.g., 'estate.kaufpreis', 'estate.ort'
  fabricObject?: any;
}

interface EstateData {
  [key: string]: any;
}

interface TemplateEditorProps {
  estateData?: EstateData;
  onSaveTemplate?: (templateData: any) => void;
}

export const TemplateEditor = ({ estateData, onSaveTemplate }: TemplateEditorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [layers, setLayers] = useState<TemplateLayer[]>([]);
  const [selectedLayer, setSelectedLayer] = useState<TemplateLayer | null>(null);
  const [templateName, setTemplateName] = useState("Neue Vorlage");
  const [activeColor, setActiveColor] = useState("#000000");

  const estateFields = [
    { key: 'kaufpreis', label: 'Kaufpreis' },
    { key: 'ort', label: 'Ort' },
    { key: 'objektart', label: 'Objektart' },
    { key: 'zimmeranzahl', label: 'Zimmer' },
    { key: 'wohnflaeche', label: 'Wohnfläche' },
    { key: 'grundstuecksflaeche', label: 'Grundstücksfläche' },
    { key: 'baujahr', label: 'Baujahr' }
  ];

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: "#ffffff",
    });

    canvas.on('selection:created', (e) => {
      const activeObject = e.selected?.[0];
      if (activeObject) {
        const layer = layers.find(l => l.fabricObject === activeObject);
        setSelectedLayer(layer || null);
      }
    });

    canvas.on('selection:cleared', () => {
      setSelectedLayer(null);
    });

    setFabricCanvas(canvas);
    toast("Template Editor bereit!");

    return () => {
      canvas.dispose();
    };
  }, []);

  const addTextLayer = () => {
    if (!fabricCanvas) return;

    const textbox = new Textbox('Beispieltext', {
      left: 100,
      top: 100,
      width: 200,
      fontSize: 20,
      fill: activeColor,
      fontFamily: 'Arial'
    });

    fabricCanvas.add(textbox);
    fabricCanvas.setActiveObject(textbox);

    const newLayer: TemplateLayer = {
      id: `text_${Date.now()}`,
      type: 'text',
      name: `Text ${layers.length + 1}`,
      fabricObject: textbox
    };

    setLayers([...layers, newLayer]);
    setSelectedLayer(newLayer);
    toast("Text-Ebene hinzugefügt");
  };

  const addImagePlaceholder = () => {
    if (!fabricCanvas) return;

    const rect = new Rect({
      left: 100,
      top: 100,
      width: 200,
      height: 150,
      fill: '#f0f0f0',
      stroke: '#ddd',
      strokeWidth: 2,
      strokeDashArray: [5, 5]
    });

    fabricCanvas.add(rect);
    fabricCanvas.setActiveObject(rect);

    const newLayer: TemplateLayer = {
      id: `image_${Date.now()}`,
      type: 'image',
      name: `Bild ${layers.length + 1}`,
      fabricObject: rect
    };

    setLayers([...layers, newLayer]);
    setSelectedLayer(newLayer);
    toast("Bild-Platzhalter hinzugefügt");
  };

  const addShape = () => {
    if (!fabricCanvas) return;

    const rect = new Rect({
      left: 100,
      top: 100,
      width: 100,
      height: 100,
      fill: activeColor
    });

    fabricCanvas.add(rect);
    fabricCanvas.setActiveObject(rect);

    const newLayer: TemplateLayer = {
      id: `shape_${Date.now()}`,
      type: 'shape',
      name: `Form ${layers.length + 1}`,
      fabricObject: rect
    };

    setLayers([...layers, newLayer]);
    setSelectedLayer(newLayer);
    toast("Form hinzugefügt");
  };

  const deleteSelectedLayer = () => {
    if (!selectedLayer || !fabricCanvas) return;

    fabricCanvas.remove(selectedLayer.fabricObject);
    setLayers(layers.filter(l => l.id !== selectedLayer.id));
    setSelectedLayer(null);
    toast("Ebene gelöscht");
  };

  const updateLayerDataBinding = (layerId: string, dataBinding: string) => {
    setLayers(layers.map(layer => 
      layer.id === layerId 
        ? { ...layer, dataBinding }
        : layer
    ));

    // Update the fabric object with estate data if available
    if (estateData && dataBinding) {
      const layer = layers.find(l => l.id === layerId);
      if (layer && layer.type === 'text' && layer.fabricObject) {
        const value = dataBinding.split('.').reduce((obj, key) => obj?.[key], estateData);
        if (value) {
          layer.fabricObject.set('text', String(value));
          fabricCanvas?.renderAll();
        }
      }
    }
  };

  const saveTemplate = () => {
    if (!fabricCanvas) return;

    const templateData = {
      name: templateName,
      canvasData: fabricCanvas.toJSON(),
      layers: layers.map(layer => ({
        id: layer.id,
        type: layer.type,
        name: layer.name,
        dataBinding: layer.dataBinding
      }))
    };

    onSaveTemplate?.(templateData);
    toast("Vorlage gespeichert!");
  };

  const exportImage = () => {
    if (!fabricCanvas) return;

    const dataURL = fabricCanvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 2
    });

    const link = document.createElement('a');
    link.download = `${templateName}.png`;
    link.href = dataURL;
    link.click();

    toast("Bild exportiert!");
  };

  return (
    <div className="h-screen flex">
      {/* Left Sidebar - Tools */}
      <div className="w-64 border-r bg-background p-4 space-y-4">
        <div>
          <Label htmlFor="templateName">Vorlagen Name</Label>
          <Input
            id="templateName"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            className="mt-1"
          />
        </div>

        <Separator />

        <div>
          <h3 className="font-semibold mb-2">Werkzeuge</h3>
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={addTextLayer}
            >
              <Type className="h-4 w-4 mr-2" />
              Text hinzufügen
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={addImagePlaceholder}
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              Bild hinzufügen
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={addShape}
            >
              <Square className="h-4 w-4 mr-2" />
              Form hinzufügen
            </Button>
          </div>
        </div>

        <Separator />

        <div>
          <Label htmlFor="colorPicker">Farbe</Label>
          <Input
            id="colorPicker"
            type="color"
            value={activeColor}
            onChange={(e) => setActiveColor(e.target.value)}
            className="mt-1 h-10"
          />
        </div>

        <Separator />

        <div>
          <h3 className="font-semibold mb-2">Aktionen</h3>
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={saveTemplate}
            >
              <Save className="h-4 w-4 mr-2" />
              Speichern
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={exportImage}
            >
              <Download className="h-4 w-4 mr-2" />
              Exportieren
            </Button>
          </div>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 p-4 bg-muted/20">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mx-auto" style={{ width: 'fit-content' }}>
          <canvas ref={canvasRef} className="border" />
        </div>
      </div>

      {/* Right Sidebar - Layer Properties */}
      <div className="w-80 border-l bg-background p-4 space-y-4">
        <div>
          <h3 className="font-semibold mb-2">Ebenen</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {layers.map((layer) => (
              <div
                key={layer.id}
                className={`p-2 border rounded cursor-pointer ${
                  selectedLayer?.id === layer.id ? 'border-primary bg-primary/5' : 'border-border'
                }`}
                onClick={() => setSelectedLayer(layer)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {layer.type === 'text' && <Type className="h-4 w-4" />}
                    {layer.type === 'image' && <ImageIcon className="h-4 w-4" />}
                    {layer.type === 'shape' && <Square className="h-4 w-4" />}
                    <span className="text-sm">{layer.name}</span>
                  </div>
                  {layer.dataBinding && (
                    <Badge variant="secondary" className="text-xs">
                      Daten
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedLayer && (
          <>
            <Separator />
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Eigenschaften</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={deleteSelectedLayer}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <Label>Ebenen Name</Label>
                  <Input
                    value={selectedLayer.name}
                    onChange={(e) => {
                      setLayers(layers.map(layer => 
                        layer.id === selectedLayer.id 
                          ? { ...layer, name: e.target.value }
                          : layer
                      ));
                    }}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Daten Verknüpfung</Label>
                  <select
                    value={selectedLayer.dataBinding || ''}
                    onChange={(e) => updateLayerDataBinding(selectedLayer.id, e.target.value)}
                    className="w-full mt-1 p-2 border rounded-md"
                  >
                    <option value="">Keine Verknüpfung</option>
                    {estateFields.map((field) => (
                      <option key={field.key} value={`estate.${field.key}`}>
                        {field.label}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedLayer.dataBinding && estateData && (
                  <div>
                    <Label>Aktueller Wert</Label>
                    <div className="p-2 bg-muted rounded mt-1 text-sm">
                      {selectedLayer.dataBinding.split('.').reduce((obj, key) => obj?.[key], estateData) || 'Nicht verfügbar'}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};