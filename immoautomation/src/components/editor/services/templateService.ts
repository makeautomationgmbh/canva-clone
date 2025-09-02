import { supabase } from '@/integrations/supabase/client';
import { DesignProject, TemplateLayer, CanvasPreset } from '../types';

export class TemplateService {
  static async saveTemplate(
    userId: string,
    templateId: string | null,
    templateData: {
      name: string;
      canvas_data: any;
      canvas_size: CanvasPreset;
      layers: TemplateLayer[];
    }
  ) {
    const data = {
      user_id: userId,
      name: templateData.name,
      canvas_data: templateData.canvas_data as any,
      canvas_size: templateData.canvas_size as any,
      layers: templateData.layers as any
    };

    if (templateId) {
      // Update existing template
      const { data: result, error } = await supabase
        .from('templates')
        .update(data)
        .eq('id', templateId)
        .eq('user_id', userId)
        .select()
        .single();
      
      return { data: result, error };
    } else {
      // Create new template
      const { data: result, error } = await supabase
        .from('templates')
        .insert(data)
        .select()
        .single();
      
      return { data: result, error };
    }
  }

  static async loadTemplate(templateId: string) {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .eq('id', templateId)
      .single();
    
    return { data, error };
  }

  static async getUserTemplates(userId: string) {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });
    
    return { data, error };
  }

  static async deleteTemplate(templateId: string, userId: string) {
    const { error } = await supabase
      .from('templates')
      .delete()
      .eq('id', templateId)
      .eq('user_id', userId);
    
    return { error };
  }

  static async generatePreview(canvasData: any, canvasSize: CanvasPreset): Promise<string> {
    // This would generate a preview image from the canvas data
    // For now, return a placeholder
    return '/placeholder-template.png';
  }
}