export interface TemplateLayer {
  id: string;
  type: 'text' | 'image' | 'shape';
  name: string;
  dataBinding?: string;
  fabricObjectId?: string;
  estateImageType?: string;
  visible?: boolean;
}

export interface CanvasPreset {
  name: string;
  ratio: string;
  width: number;
  height: number;
}

export interface ExtendedFabricObject {
  id?: string;
  layerId?: string;
}

export interface DesignProject {
  id: string;
  user_id: string;
  name: string;
  canvas_data: any;
  canvas_size: CanvasPreset;
  layers: TemplateLayer[];
  preview_url?: string;
  created_at: string;
  updated_at: string;
}

export interface TemplateEditorProps {
  estateData?: any;
  onSaveTemplate?: (templateData: any) => void;
  templateId?: string | null;
}