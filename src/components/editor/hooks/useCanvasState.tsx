import { useState, useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { TemplateLayer } from '../types';

export const useCanvasState = () => {
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [layers, setLayers] = useState<TemplateLayer[]>([]);
  const [selectedLayer, setSelectedLayer] = useState<TemplateLayer | null>(null);
  const [currentTemplateId, setCurrentTemplateId] = useState<string | null>(null);

  const clearCanvas = useCallback(() => {
    if (fabricCanvas) {
      fabricCanvas.clear();
      setLayers([]);
      setSelectedLayer(null);
    }
  }, [fabricCanvas]);

  const addLayer = useCallback((layer: TemplateLayer) => {
    setLayers(prev => [...prev, layer]);
  }, []);

  const updateLayer = useCallback((layerId: string, updates: Partial<TemplateLayer>) => {
    setLayers(prev => prev.map(layer => 
      layer.id === layerId ? { ...layer, ...updates } : layer
    ));
  }, []);

  const removeLayer = useCallback((layerId: string) => {
    setLayers(prev => prev.filter(layer => layer.id !== layerId));
    if (selectedLayer?.id === layerId) {
      setSelectedLayer(null);
    }
  }, [selectedLayer]);

  return {
    fabricCanvas,
    setFabricCanvas,
    layers,
    setLayers,
    selectedLayer,
    setSelectedLayer,
    currentTemplateId,
    setCurrentTemplateId,
    clearCanvas,
    addLayer,
    updateLayer,
    removeLayer
  };
};