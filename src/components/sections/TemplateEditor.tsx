import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, Textbox, FabricImage, Rect, Circle, Group } from "fabric";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { 
  Type, 
  Image as ImageIcon, 
  Square, 
  Circle as CircleIcon,
  Trash2, 
  Save, 
  Download,
  Settings,
  Palette,
  Move,
  RotateCw,
  Copy,
  Layers,
  AlignCenter,
  AlignLeft,
  AlignRight
} from "lucide-react";
import { toast } from "sonner";

interface TemplateLayer {
  id: string;
  type: 'text' | 'image' | 'shape';
  name: string;
  dataBinding?: string;
  fabricObject?: any;
  estateImageType?: string; // 'Titelbild' | 'Foto' | 'Grundriss'
}

interface EstateData {
  [key: string]: any;
  images?: Array<{
    id: number;
    type: string;
    elements: {
      type: string;
      title: string;
      imageUrl: string;
      originalname: string;
    };
  }>;
}

interface CanvasPreset {
  name: string;
  ratio: string;
  width: number;
  height: number;
}

interface TemplateEditorProps {
  estateData?: EstateData;
  onSaveTemplate?: (templateData: any) => void;
}

const canvasPresets: CanvasPreset[] = [
  { name: "Quadrat (1:1)", ratio: "1:1", width: 600, height: 600 },
  { name: "Portrait (3:4)", ratio: "3:4", width: 600, height: 800 },
  { name: "Landscape (4:3)", ratio: "4:3", width: 800, height: 600 },
  { name: "Widescreen (16:9)", ratio: "16:9", width: 800, height: 450 },
  { name: "Story (9:16)", ratio: "9:16", width: 450, height: 800 }
];

export const TemplateEditor = ({ estateData, onSaveTemplate }: TemplateEditorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [layers, setLayers] = useState<TemplateLayer[]>([]);
  const [selectedLayer, setSelectedLayer] = useState<TemplateLayer | null>(null);
  const [templateName, setTemplateName] = useState("Neue Vorlage");
  const [activeColor, setActiveColor] = useState("#000000");
  const [selectedPreset, setSelectedPreset] = useState<CanvasPreset>(canvasPresets[0]);
  const [fontSize, setFontSize] = useState([20]);
  const [fontWeight, setFontWeight] = useState("normal");
  const [textAlign, setTextAlign] = useState("left");

  const estateFields = [
    { key: 'kaufpreis', label: 'Kaufpreis' },
    { key: 'ort', label: 'Ort' },
    { key: 'objektart', label: 'Objektart' },
    { key: 'zimmeranzahl', label: 'Zimmer' },
    { key: 'wohnflaeche', label: 'Wohnfläche' },
    { key: 'grundstuecksflaeche', label: 'Grundstücksfläche' },
    { key: 'baujahr', label: 'Baujahr' }
  ];

  const imageTypes = [
    { value: 'Titelbild', label: 'Titelbild' },
    { value: 'Foto', label: 'Foto' },
    { value: 'Grundriss', label: 'Grundriss' }
  ];

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: selectedPreset.width,
      height: selectedPreset.height,
      backgroundColor: "#ffffff",
    });

    canvas.on('selection:created', (e) => {
      const activeObject = e.selected?.[0];
      if (activeObject) {
        const layer = layers.find(l => l.fabricObject === activeObject);
        setSelectedLayer(layer || null);
        
        // Update UI controls based on selected object
        if (activeObject.type === 'textbox') {
          const textObj = activeObject as Textbox;
          setFontSize([textObj.fontSize || 20]);
          setFontWeight(String(textObj.fontWeight || 'normal'));
          setTextAlign(textObj.textAlign || 'left');
          const fillColor = typeof textObj.fill === 'string' ? textObj.fill : '#000000';
          setActiveColor(fillColor);
        }
      }
    });

    canvas.on('selection:updated', (e) => {
      const activeObject = e.selected?.[0];
      if (activeObject) {
        const layer = layers.find(l => l.fabricObject === activeObject);
        setSelectedLayer(layer || null);
        
        if (activeObject.type === 'textbox') {
          const textObj = activeObject as Textbox;
          setFontSize([textObj.fontSize || 20]);
          setFontWeight(String(textObj.fontWeight || 'normal'));
          setTextAlign(textObj.textAlign || 'left');
          const fillColor = typeof textObj.fill === 'string' ? textObj.fill : '#000000';
          setActiveColor(fillColor);
        }
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
  }, [selectedPreset]);

  const changeCanvasSize = (preset: CanvasPreset) => {
    if (!fabricCanvas) return;
    
    setSelectedPreset(preset);
    fabricCanvas.setDimensions({
      width: preset.width,
      height: preset.height
    });
    fabricCanvas.renderAll();
    toast(`Canvas-Größe geändert zu ${preset.name}`);
  };

  const addTextLayer = () => {
    if (!fabricCanvas) return;

    const textbox = new Textbox('Beispieltext', {
      left: 100,
      top: 100,
      width: 200,
      fontSize: fontSize[0],
      fill: activeColor,
      fontFamily: 'Arial',
      fontWeight: fontWeight,
      textAlign: textAlign
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
      fill: '#f8f9fa',
      stroke: '#6c757d',
      strokeWidth: 2,
      strokeDashArray: [10, 5],
      rx: 8,
      ry: 8
    });

    // Add text overlay to indicate it's an image placeholder
    const placeholderText = new Textbox('Bild Platzhalter', {
      left: 120,
      top: 165,
      fontSize: 12,
      fill: '#6c757d',
      fontFamily: 'Arial',
      selectable: false,
      evented: false
    });

    const group = new Group([rect, placeholderText], {
      left: 100,
      top: 100
    });
    
    fabricCanvas.add(group);
    fabricCanvas.setActiveObject(group);

    const newLayer: TemplateLayer = {
      id: `image_${Date.now()}`,
      type: 'image',
      name: `Bild ${layers.length + 1}`,
      fabricObject: group
    };

    setLayers([...layers, newLayer]);
    setSelectedLayer(newLayer);
    toast("Bild-Platzhalter hinzugefügt");
  };

  const addCircleShape = () => {
    if (!fabricCanvas) return;

    const circle = new Circle({
      left: 100,
      top: 100,
      radius: 50,
      fill: activeColor,
      stroke: '#000000',
      strokeWidth: 0
    });

    fabricCanvas.add(circle);
    fabricCanvas.setActiveObject(circle);

    const newLayer: TemplateLayer = {
      id: `circle_${Date.now()}`,
      type: 'shape',
      name: `Kreis ${layers.length + 1}`,
      fabricObject: circle
    };

    setLayers([...layers, newLayer]);
    setSelectedLayer(newLayer);
    toast("Kreis hinzugefügt");
  };

  const addRectangleShape = () => {
    if (!fabricCanvas) return;

    const rect = new Rect({
      left: 100,
      top: 100,
      width: 100,
      height: 100,
      fill: activeColor,
      stroke: '#000000',
      strokeWidth: 0,
      rx: 0,
      ry: 0
    });

    fabricCanvas.add(rect);
    fabricCanvas.setActiveObject(rect);

    const newLayer: TemplateLayer = {
      id: `rectangle_${Date.now()}`,
      type: 'shape',
      name: `Rechteck ${layers.length + 1}`,
      fabricObject: rect
    };

    setLayers([...layers, newLayer]);
    setSelectedLayer(newLayer);
    toast("Rechteck hinzugefügt");
  };

  const updateSelectedObjectProperty = (property: string, value: any) => {
    if (!selectedLayer?.fabricObject || !fabricCanvas) return;

    selectedLayer.fabricObject.set(property, value);
    fabricCanvas.renderAll();
  };

  const duplicateSelectedLayer = () => {
    if (!selectedLayer || !fabricCanvas) return;

    selectedLayer.fabricObject.clone((cloned: any) => {
      cloned.set({
        left: cloned.left + 20,
        top: cloned.top + 20,
      });
      fabricCanvas.add(cloned);
      fabricCanvas.setActiveObject(cloned);

      const newLayer: TemplateLayer = {
        id: `${selectedLayer.type}_${Date.now()}`,
        type: selectedLayer.type,
        name: `${selectedLayer.name} Kopie`,
        fabricObject: cloned,
        dataBinding: selectedLayer.dataBinding,
        estateImageType: selectedLayer.estateImageType
      };

      setLayers([...layers, newLayer]);
      setSelectedLayer(newLayer);
      toast("Ebene dupliziert");
    });
  };

  const loadEstateImage = (layerId: string, imageType: string) => {
    if (!estateData?.images || !fabricCanvas) return;

    const estateImage = estateData.images.find(img => img.elements.type === imageType);
    if (!estateImage) {
      toast.error(`Kein ${imageType} Bild gefunden`);
      return;
    }

    const layer = layers.find(l => l.id === layerId);
    if (!layer) return;

    FabricImage.fromURL(estateImage.elements.imageUrl, {
      crossOrigin: 'anonymous'
    }).then((img) => {
      // Scale image to fit placeholder
      const placeholder = layer.fabricObject;
      const scaleX = placeholder.width! / img.width!;
      const scaleY = placeholder.height! / img.height!;
      const scale = Math.min(scaleX, scaleY);

      img.set({
        left: placeholder.left,
        top: placeholder.top,
        scaleX: scale,
        scaleY: scale
      });

      fabricCanvas.remove(placeholder);
      fabricCanvas.add(img);
      fabricCanvas.setActiveObject(img);

      // Update layer
      setLayers(layers.map(l => 
        l.id === layerId 
          ? { ...l, fabricObject: img, estateImageType: imageType }
          : l
      ));

      toast.success(`${imageType} Bild geladen`);
    }).catch(() => {
      toast.error("Fehler beim Laden des Bildes");
    });
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
      canvasSize: selectedPreset,
      layers: layers.map(layer => ({
        id: layer.id,
        type: layer.type,
        name: layer.name,
        dataBinding: layer.dataBinding,
        estateImageType: layer.estateImageType
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
      <div className="w-72 border-r bg-background p-4 space-y-4 overflow-y-auto">
        <div>
          <Label htmlFor="templateName">Vorlagen Name</Label>
          <Input
            id="templateName"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label>Canvas-Größe</Label>
          <Select 
            value={selectedPreset.ratio}
            onValueChange={(value) => {
              const preset = canvasPresets.find(p => p.ratio === value);
              if (preset) changeCanvasSize(preset);
            }}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {canvasPresets.map((preset) => (
                <SelectItem key={preset.ratio} value={preset.ratio}>
                  {preset.name} ({preset.width}x{preset.height})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        <div>
          <h3 className="font-semibold mb-3">Elemente hinzufügen</h3>
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={addTextLayer}
            >
              <Type className="h-4 w-4 mr-2" />
              Text
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={addImagePlaceholder}
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              Bild Platzhalter
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={addRectangleShape}
            >
              <Square className="h-4 w-4 mr-2" />
              Rechteck
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={addCircleShape}
            >
              <CircleIcon className="h-4 w-4 mr-2" />
              Kreis
            </Button>
          </div>
        </div>

        {selectedLayer && selectedLayer.type === 'text' && (
          <>
            <Separator />
            <div>
              <h3 className="font-semibold mb-3">Text Eigenschaften</h3>
              <div className="space-y-3">
                <div>
                  <Label>Schriftgröße: {fontSize[0]}px</Label>
                  <Slider
                    value={fontSize}
                    onValueChange={(value) => {
                      setFontSize(value);
                      updateSelectedObjectProperty('fontSize', value[0]);
                    }}
                    max={100}
                    min={8}
                    step={1}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Schriftgewicht</Label>
                  <Select 
                    value={fontWeight}
                    onValueChange={(value) => {
                      setFontWeight(value);
                      updateSelectedObjectProperty('fontWeight', value);
                    }}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="bold">Fett</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Textausrichtung</Label>
                  <div className="flex space-x-1 mt-1">
                    <Button
                      variant={textAlign === 'left' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        setTextAlign('left');
                        updateSelectedObjectProperty('textAlign', 'left');
                      }}
                    >
                      <AlignLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={textAlign === 'center' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        setTextAlign('center');
                        updateSelectedObjectProperty('textAlign', 'center');
                      }}
                    >
                      <AlignCenter className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={textAlign === 'right' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        setTextAlign('right');
                        updateSelectedObjectProperty('textAlign', 'right');
                      }}
                    >
                      <AlignRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        <Separator />

        <div>
          <Label htmlFor="colorPicker">Farbe</Label>
          <Input
            id="colorPicker"
            type="color"
            value={activeColor}
            onChange={(e) => {
              setActiveColor(e.target.value);
              if (selectedLayer?.fabricObject) {
                updateSelectedObjectProperty('fill', e.target.value);
              }
            }}
            className="mt-1 h-10"
          />
        </div>

        <Separator />

        <div>
          <h3 className="font-semibold mb-2">Aktionen</h3>
          <div className="space-y-2">
            {selectedLayer && (
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={duplicateSelectedLayer}
              >
                <Copy className="h-4 w-4 mr-2" />
                Duplizieren
              </Button>
            )}
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
      <div className="flex-1 p-4 bg-muted/20 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ width: 'fit-content' }}>
          <canvas ref={canvasRef} className="border" />
        </div>
      </div>

      {/* Right Sidebar - Layer Properties */}
      <div className="w-80 border-l bg-background p-4 space-y-4 overflow-y-auto">
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <Layers className="h-4 w-4" />
            <h3 className="font-semibold">Ebenen</h3>
          </div>
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
                  <div className="flex space-x-1">
                    {layer.dataBinding && (
                      <Badge variant="secondary" className="text-xs">
                        Daten
                      </Badge>
                    )}
                    {layer.estateImageType && (
                      <Badge variant="outline" className="text-xs">
                        {layer.estateImageType}
                      </Badge>
                    )}
                  </div>
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

                {selectedLayer.type === 'text' && (
                  <div>
                    <Label>Text Daten Verknüpfung</Label>
                    <Select
                      value={selectedLayer.dataBinding || ''}
                      onValueChange={(value) => updateLayerDataBinding(selectedLayer.id, value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Datenfeld auswählen" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Keine Verknüpfung</SelectItem>
                        {estateFields.map((field) => (
                          <SelectItem key={field.key} value={`estate.${field.key}`}>
                            {field.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {selectedLayer.type === 'image' && estateData?.images && (
                  <div>
                    <Label>Estate Bild laden</Label>
                    <Select
                      onValueChange={(value) => loadEstateImage(selectedLayer.id, value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Bildtyp auswählen" />
                      </SelectTrigger>
                      <SelectContent>
                        {imageTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {selectedLayer.dataBinding && estateData && (
                  <div>
                    <Label>Aktueller Wert</Label>
                    <div className="p-2 bg-muted rounded mt-1 text-sm">
                      {selectedLayer.dataBinding.split('.').reduce((obj, key) => obj?.[key], estateData) || 'Nicht verfügbar'}
                    </div>
                  </div>
                )}

                {selectedLayer.estateImageType && estateData?.images && (
                  <div>
                    <Label>Geladenes Bild</Label>
                    <div className="p-2 bg-muted rounded mt-1 text-sm">
                      {selectedLayer.estateImageType}
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