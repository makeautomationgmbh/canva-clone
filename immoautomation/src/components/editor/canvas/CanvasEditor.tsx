import { useEffect, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { CanvasPreset } from '../types';

interface CanvasEditorProps {
  selectedPreset: CanvasPreset;
  onCanvasReady: (canvas: FabricCanvas) => void;
  onSelectionChange: (hasSelection: boolean, selectedObject?: any) => void;
}

export const CanvasEditor = ({ selectedPreset, onCanvasReady, onSelectionChange }: CanvasEditorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: selectedPreset.width,
      height: selectedPreset.height,
      backgroundColor: "#ffffff",
    });

    // Canvas event listeners
    canvas.on('selection:created', (e) => {
      const activeObject = e.selected?.[0];
      onSelectionChange(true, activeObject);
    });

    canvas.on('selection:updated', (e) => {
      const activeObject = e.selected?.[0];
      onSelectionChange(true, activeObject);
    });

    canvas.on('selection:cleared', () => {
      onSelectionChange(false);
    });

    onCanvasReady(canvas);

    return () => {
      canvas.dispose();
    };
  }, [selectedPreset, onCanvasReady, onSelectionChange]);

  return (
    <div className="flex-1 p-4 bg-muted/20 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ width: 'fit-content' }}>
        <canvas ref={canvasRef} className="border" />
      </div>
    </div>
  );
};