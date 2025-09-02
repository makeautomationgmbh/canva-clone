import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface OnOfficeEstate {
  id: number;
  elements: {
    id?: number;
    objektnr_extern?: string;
    objektnr_intern?: string;
    status?: string;
    kaufpreis?: string;
    kaltmiete?: string;
    warmmiete?: string;
    nebenkosten?: string;
    objekttitel?: string;
    objektbeschreibung?: string;
    objektart?: string;
    vermarktungsart?: string;
    nutzungsart?: string;
    wohnflaeche?: string;
    nutzflaeche?: string;
    grundstueck?: string;
    zimmer?: string;
    schlafzimmer?: string;
    badezimmer?: string;
    etage?: string;
    anzahl_etagen?: string;
    baujahr?: string;
    lage?: string;
    plz?: string;
    ort?: string;
    strasse?: string;
    hausnummer?: string;
    bundesland?: string;
    land?: string;
    erstellt_am?: string;
    geaendert_am?: string;
    [key: string]: any;
  };
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
    // onOffice API returns data in response.results[0].data.records
    return result?.response?.results?.[0]?.data?.records || [];
  };

  const getEstateFiles = async (estateId: number): Promise<OnOfficeFile[]> => {
    const result = await callAPI('getEstateFiles', { estateId });
    return result?.response?.results?.[0]?.data?.records || [];
  };

  const getAddresses = async (parameters = {}): Promise<OnOfficeAddress[]> => {
    const result = await callAPI('getAddresses', { parameters });
    return result?.response?.results?.[0]?.data?.records || [];
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