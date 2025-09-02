import { useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Download, Copy, Trash2, Layers } from "lucide-react";
import { toast } from "sonner";

import { useCanvasState } from "./hooks/useCanvasState";
import { CanvasEditor } from "./canvas/CanvasEditor";
import { TextTool } from "./tools/TextTool";
import { ShapeTool } from "./tools/ShapeTool";
import { TemplateService } from "./services/templateService";
import { CanvasPreset, TemplateLayer, ExtendedFabricObject, TemplateEditorProps } from "./types";

const canvasPresets: CanvasPreset[] = [
  { name: "Square (1:1)", ratio: "1:1", width: 600, height: 600 },
  { name: "Portrait (3:4)", ratio: "3:4", width: 600, height: 800 },
  { name: "Landscape (4:3)", ratio: "4:3", width: 800, height: 600 },
  { name: "Widescreen (16:9)", ratio: "16:9", width: 800, height: 450 },
  { name: "Story (9:16)", ratio: "9:16", width: 450, height: 800 }
];

export const ModularTemplateEditor = ({ estateData, onSaveTemplate, templateId }: TemplateEditorProps) => {
  const { user } = useAuth();
  const {
    fabricCanvas,
    setFabricCanvas,
    layers,
    selectedLayer,
    setSelectedLayer,
    currentTemplateId,
    setCurrentTemplateId,
    addLayer,
    updateLayer,
    removeLayer
  } = useCanvasState();

  const [templateName, setTemplateName] = useState("New Design");
  const [activeColor, setActiveColor] = useState("#000000");
  const [selectedPreset, setSelectedPreset] = useState<CanvasPreset>(canvasPresets[0]);
  const [isSaving, setIsSaving] = useState(false);

  const handleCanvasReady = useCallback((canvas: any) => {
    setFabricCanvas(canvas);
    if (templateId) {
      loadTemplate(templateId);
    }
  }, [templateId]);

  const handleSelectionChange = useCallback((hasSelection: boolean, selectedObject?: any) => {
    if (hasSelection && selectedObject) {
      const layer = layers.find(l => l.fabricObjectId === (selectedObject as ExtendedFabricObject).id);
      setSelectedLayer(layer || null);
    } else {
      setSelectedLayer(null);
    }
  }, [layers, setSelectedLayer]);

  const loadTemplate = async (id: string) => {
    if (!fabricCanvas) return;
    
    try {
      const { data: template, error } = await TemplateService.loadTemplate(id);
      if (error) throw error;

      setCurrentTemplateId(template.id);
      setTemplateName(template.name);
      
      // Load canvas data
      fabricCanvas.loadFromJSON(template.canvas_data as any, () => {
        if (template.canvas_size) {
          const canvasSize = template.canvas_size as unknown as CanvasPreset;
          setSelectedPreset(canvasSize);
          fabricCanvas.setDimensions({
            width: canvasSize.width,
            height: canvasSize.height
          });
        }
        fabricCanvas.renderAll();
      });
      
      toast.success('Template loaded successfully!');
    } catch (error) {
      toast.error('Failed to load template');
      console.error('Load template error:', error);
    }
  };

  const saveTemplate = async () => {
    if (!fabricCanvas || !user) {
      toast.error('You must be logged in to save templates');
      return;
    }

    setIsSaving(true);
    
    try {
      const templateData = {
        name: templateName,
        canvas_data: fabricCanvas.toJSON(),
        canvas_size: selectedPreset,
        layers: layers
      };

      const { data, error } = await TemplateService.saveTemplate(
        user.id,
        currentTemplateId,
        templateData
      );

      if (error) throw error;

      if (!currentTemplateId && data) {
        setCurrentTemplateId(data.id);
      }

      toast.success(currentTemplateId ? 'Template updated!' : 'Template created!');
      onSaveTemplate?.(templateData);
    } catch (error) {
      toast.error('Failed to save template');
      console.error('Save template error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const updateSelectedObjectProperty = (property: string, value: any) => {
    if (!selectedLayer?.fabricObjectId || !fabricCanvas) return;

    const fabricObject = fabricCanvas.getObjects().find(
      (obj: any) => (obj as ExtendedFabricObject).id === selectedLayer.fabricObjectId
    );
    
    if (fabricObject) {
      fabricObject.set(property, value);
      fabricCanvas.renderAll();
    }
  };

  const deleteSelectedLayer = () => {
    if (!selectedLayer || !fabricCanvas) return;

    const fabricObject = fabricCanvas.getObjects().find(
      (obj: any) => (obj as ExtendedFabricObject).id === selectedLayer.fabricObjectId
    );
    
    if (fabricObject) {
      fabricCanvas.remove(fabricObject);
    }
    
    removeLayer(selectedLayer.id);
    toast('Layer deleted');
  };

  const changeCanvasSize = (preset: CanvasPreset) => {
    if (!fabricCanvas) return;
    
    setSelectedPreset(preset);
    fabricCanvas.setDimensions({
      width: preset.width,
      height: preset.height
    });
    fabricCanvas.renderAll();
    toast(`Canvas size changed to ${preset.name}`);
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

    toast("Image exported!");
  };

  return (
    <div className="h-screen flex">
      {/* Left Sidebar - Tools */}
      <div className="w-72 border-r bg-background p-4 space-y-4 overflow-y-auto">
        <div>
          <Label htmlFor="templateName">Design Name</Label>
          <Input
            id="templateName"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label>Canvas Size</Label>
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

        <div className="space-y-4">
          <TextTool
            fabricCanvas={fabricCanvas}
            onLayerAdd={addLayer}
            selectedLayer={selectedLayer}
            onPropertyUpdate={updateSelectedObjectProperty}
          />
          
          <ShapeTool
            fabricCanvas={fabricCanvas}
            onLayerAdd={addLayer}
            activeColor={activeColor}
          />
        </div>

        <div>
          <Label htmlFor="colorPicker">Color</Label>
          <Input
            id="colorPicker"
            type="color"
            value={activeColor}
            onChange={(e) => {
              setActiveColor(e.target.value);
              if (selectedLayer?.fabricObjectId) {
                updateSelectedObjectProperty('fill', e.target.value);
              }
            }}
            className="mt-1 h-10"
          />
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold">Actions</h3>
          {selectedLayer && (
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => {/* TODO: Implement duplicate */}}
            >
              <Copy className="h-4 w-4 mr-2" />
              Duplicate
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={saveTemplate}
            disabled={isSaving || !user}
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={exportImage}
          >
            <Download className="h-4 w-4 mr-2" />
            Export PNG
          </Button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <CanvasEditor
        selectedPreset={selectedPreset}
        onCanvasReady={handleCanvasReady}
        onSelectionChange={handleSelectionChange}
      />

      {/* Right Sidebar - Layers */}
      <div className="w-80 border-l bg-background p-4 space-y-4 overflow-y-auto">
        <div className="flex items-center space-x-2 mb-3">
          <Layers className="h-4 w-4" />
          <h3 className="font-semibold">Layers</h3>
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
                <span className="text-sm">{layer.name}</span>
                {selectedLayer?.id === layer.id && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSelectedLayer();
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
          {layers.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No layers yet. Add some elements!
            </p>
          )}
        </div>

        {selectedLayer && (
          <div className="space-y-3">
            <h3 className="font-semibold">Layer Properties</h3>
            <div>
              <Label>Layer Name</Label>
              <Input
                value={selectedLayer.name}
                onChange={(e) => {
                  updateLayer(selectedLayer.id, { name: e.target.value });
                }}
                className="mt-1"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};