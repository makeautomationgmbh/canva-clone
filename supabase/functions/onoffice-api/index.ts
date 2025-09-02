import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OnOfficeConfig {
  token: string;
  secret: string;
  actionId: string;
  resourceId?: string;
  identifier?: string;
  resourceType: string;
  parameters?: Record<string, any>;
}

class OnOfficeAPI {
  private token: string;
  private secret: string;
  private baseUrl = 'https://api.onoffice.de/api/stable/api.php';

  constructor(token: string, secret: string) {
    this.token = token;
    this.secret = secret;
  }

  private generateHMAC(publicKey: string, timestamp: number, data: string): string {
    const message = `${publicKey}${timestamp}${this.token}${data}`;
    
    // Create HMAC-SHA256 signature
    const key = new TextEncoder().encode(this.secret);
    const messageBytes = new TextEncoder().encode(message);
    
    return crypto.subtle.importKey(
      'raw',
      key,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    ).then(cryptoKey => {
      return crypto.subtle.sign('HMAC', cryptoKey, messageBytes);
    }).then(signature => {
      return Array.from(new Uint8Array(signature))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    });
  }

  async makeRequest(config: OnOfficeConfig) {
    const timestamp = Math.floor(Date.now() / 1000);
    const publicKey = crypto.randomUUID();
    
    const requestData = {
      actionid: config.actionId,
      resourceid: config.resourceId || '',
      identifier: config.identifier || '',
      resourcetype: config.resourceType,
      parameters: config.parameters || {}
    };

    const data = JSON.stringify(requestData);
    const hmac = await this.generateHMAC(publicKey, timestamp, data);

    const formData = new FormData();
    formData.append('token', this.token);
    formData.append('request', data);
    formData.append('hmac', hmac);
    formData.append('publickey', publicKey);
    formData.append('timestamp', timestamp.toString());

    console.log('Making onOffice API request:', {
      actionId: config.actionId,
      resourceType: config.resourceType,
      timestamp
    });

    const response = await fetch(this.baseUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('onOffice API response:', result);
    
    return result;
  }

  // Get real estate listings
  async getEstates(parameters = {}) {
    return this.makeRequest({
      token: this.token,
      secret: this.secret,
      actionId: 'urn:onoffice-de-ns:smart:2.5:smartml:action:read',
      resourceType: 'estate',
      parameters: {
        data: ['Id', 'kaufpreis', 'lage', 'objekttitel', 'objektbeschreibung', 'objektart', 'wohnflaeche', 'grundstueck', 'zimmer', 'badezimmer'],
        listlimit: 50,
        ...parameters
      }
    });
  }

  // Get estate images
  async getEstateFiles(estateId: number) {
    return this.makeRequest({
      token: this.token,
      secret: this.secret,
      actionId: 'urn:onoffice-de-ns:smart:2.5:smartml:action:read',
      resourceType: 'file',
      parameters: {
        parentids: [estateId],
        data: ['name', 'url', 'title', 'type']
      }
    });
  }

  // Get contact/agent information
  async getAddresses(parameters = {}) {
    return this.makeRequest({
      token: this.token,
      secret: this.secret,
      actionId: 'urn:onoffice-de-ns:smart:2.5:smartml:action:read',
      resourceType: 'address',
      parameters: {
        data: ['Name', 'Vorname', 'Email', 'Telefon1', 'Firma'],
        listlimit: 20,
        ...parameters
      }
    });
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Get user from JWT token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Invalid token');
    }

    const { action, ...requestData } = await req.json();
    
    const token = Deno.env.get('ONOFFICE_API_TOKEN');
    const secret = Deno.env.get('ONOFFICE_API_SECRET');

    if (!token || !secret) {
      throw new Error('onOffice API credentials not configured');
    }

    const api = new OnOfficeAPI(token, secret);
    let result;

    console.log('onOffice API action:', action);

    switch (action) {
      case 'getEstates':
        result = await api.getEstates(requestData.parameters);
        break;
      
      case 'getEstateFiles':
        if (!requestData.estateId) {
          throw new Error('Estate ID is required');
        }
        result = await api.getEstateFiles(requestData.estateId);
        break;
      
      case 'getAddresses':
        result = await api.getAddresses(requestData.parameters);
        break;
      
      case 'testConnection':
        // Test connection by getting a small list of estates
        result = await api.getEstates({ listlimit: 1 });
        break;
      
      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      data: result,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in onoffice-api function:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});