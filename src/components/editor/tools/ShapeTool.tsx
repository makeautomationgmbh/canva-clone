import { Button } from '@/components/ui/button';
import { Square, Circle as CircleIcon } from 'lucide-react';
import { Rect, Circle } from 'fabric';
import { ExtendedFabricObject, TemplateLayer } from '../types';

interface ShapeToolProps {
  fabricCanvas: any;
  onLayerAdd: (layer: TemplateLayer) => void;
  activeColor: string;
}

export const ShapeTool = ({ fabricCanvas, onLayerAdd, activeColor }: ShapeToolProps) => {
  const generateId = () => `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const addShape = (type: 'rectangle' | 'circle') => {
    if (!fabricCanvas) return;

    const shapeId = generateId();
    let shape: Rect | Circle;

    if (type === 'rectangle') {
      shape = new Rect({
        left: 100,
        top: 100,
        width: 100,
        height: 100,
        fill: activeColor,
      });
    } else {
      shape = new Circle({
        left: 100,
        top: 100,
        radius: 50,
        fill: activeColor,
      });
    }

    (shape as ExtendedFabricObject).id = shapeId;
    
    fabricCanvas.add(shape);
    fabricCanvas.setActiveObject(shape);

    const newLayer: TemplateLayer = {
      id: `shape_${Date.now()}`,
      type: 'shape',
      name: `${type === 'rectangle' ? 'Rectangle' : 'Circle'}`,
      fabricObjectId: shapeId,
      visible: true
    };

    onLayerAdd(newLayer);
  };

  return (
    <div className="space-y-2">
      <h3 className="font-semibold mb-3">Shapes</h3>
      <Button
        variant="outline"
        size="sm"
        className="w-full justify-start"
        onClick={() => addShape('rectangle')}
      >
        <Square className="h-4 w-4 mr-2" />
        Rectangle
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="w-full justify-start"
        onClick={() => addShape('circle')}
      >
        <CircleIcon className="h-4 w-4 mr-2" />
        Circle
      </Button>
    </div>
  );
};