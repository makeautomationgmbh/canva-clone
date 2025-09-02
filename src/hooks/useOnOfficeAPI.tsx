import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface OnOfficeEstate {
  Id: number;
  kaufpreis?: string;
  lage?: string;
  objekttitel?: string;
  objektbeschreibung?: string;
  objektart?: string;
  wohnflaeche?: string;
  grundstueck?: string;
  zimmer?: string;
  badezimmer?: string;
}

export interface OnOfficeFile {
  name: string;
  url: string;
  title?: string;
  type?: string;
}

export interface OnOfficeAddress {
  Name?: string;
  Vorname?: string;
  Email?: string;
  Telefon1?: string;
  Firma?: string;
}

export const useOnOfficeAPI = () => {
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const { toast } = useToast();

  const callAPI = async (action: string, data: any = {}) => {
    try {
      setLoading(true);
      
      const { data: result, error } = await supabase.functions.invoke('onoffice-api', {
        body: { action, ...data }
      });

      if (error) {
        throw error;
      }

      if (!result.success) {
        throw new Error(result.error || 'API call failed');
      }

      return result.data;
    } catch (error: any) {
      console.error('onOffice API error:', error);
      toast({
        title: "onOffice API Fehler",
        description: error.message || "Verbindung zu onOffice fehlgeschlagen",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async (): Promise<boolean> => {
    try {
      await callAPI('testConnection');
      setConnected(true);
      toast({
        title: "Verbindung erfolgreich",
        description: "onOffice API ist erfolgreich verbunden",
      });
      return true;
    } catch (error) {
      setConnected(false);
      return false;
    }
  };

  const getEstates = async (parameters = {}): Promise<OnOfficeEstate[]> => {
    const result = await callAPI('getEstates', { parameters });
    return result?.response?.results || [];
  };

  const getEstateFiles = async (estateId: number): Promise<OnOfficeFile[]> => {
    const result = await callAPI('getEstateFiles', { estateId });
    return result?.response?.results || [];
  };

  const getAddresses = async (parameters = {}): Promise<OnOfficeAddress[]> => {
    const result = await callAPI('getAddresses', { parameters });
    return result?.response?.results || [];
  };

  return {
    loading,
    connected,
    testConnection,
    getEstates,
    getEstateFiles,
    getAddresses,
  };
};