import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Type, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { Textbox } from 'fabric';
import { ExtendedFabricObject, TemplateLayer } from '../types';

interface TextToolProps {
  fabricCanvas: any;
  onLayerAdd: (layer: TemplateLayer) => void;
  selectedLayer?: TemplateLayer | null;
  onPropertyUpdate: (property: string, value: any) => void;
}

export const TextTool = ({ fabricCanvas, onLayerAdd, selectedLayer, onPropertyUpdate }: TextToolProps) => {
  const [fontSize, setFontSize] = useState([20]);
  const [fontWeight, setFontWeight] = useState("normal");
  const [textAlign, setTextAlign] = useState("left");

  const generateId = () => `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const addText = () => {
    if (!fabricCanvas) return;

    const textId = generateId();
    const text = new Textbox("Click to edit", {
      left: 100,
      top: 100,
      fontSize: fontSize[0],
      fill: '#000000',
      fontWeight: fontWeight,
      textAlign: textAlign as any,
      width: 200,
    });
    
    (text as ExtendedFabricObject).id = textId;
    
    fabricCanvas.add(text);
    fabricCanvas.setActiveObject(text);

    const newLayer: TemplateLayer = {
      id: `text_${Date.now()}`,
      type: 'text',
      name: `Text ${Date.now()}`,
      fabricObjectId: textId,
      visible: true
    };

    onLayerAdd(newLayer);
  };

  const updateProperty = (property: string, value: any) => {
    onPropertyUpdate(property, value);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold mb-3 flex items-center">
          <Type className="h-4 w-4 mr-2" />
          Text Tool
        </h3>
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start"
          onClick={addText}
        >
          <Type className="h-4 w-4 mr-2" />
          Add Text
        </Button>
      </div>

      {selectedLayer?.type === 'text' && (
        <div className="space-y-3">
          <div>
            <Label>Font Size: {fontSize[0]}px</Label>
            <Slider
              value={fontSize}
              onValueChange={(value) => {
                setFontSize(value);
                updateProperty('fontSize', value[0]);
              }}
              max={100}
              min={8}
              step={1}
              className="mt-2"
            />
          </div>

          <div>
            <Label>Font Weight</Label>
            <Select 
              value={fontWeight}
              onValueChange={(value) => {
                setFontWeight(value);
                updateProperty('fontWeight', value);
              }}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="bold">Bold</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Text Alignment</Label>
            <div className="flex space-x-1 mt-1">
              <Button
                variant={textAlign === 'left' ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setTextAlign('left');
                  updateProperty('textAlign', 'left');
                }}
              >
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button
                variant={textAlign === 'center' ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setTextAlign('center');
                  updateProperty('textAlign', 'center');
                }}
              >
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button
                variant={textAlign === 'right' ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setTextAlign('right');
                  updateProperty('textAlign', 'right');
                }}
              >
                <AlignRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};