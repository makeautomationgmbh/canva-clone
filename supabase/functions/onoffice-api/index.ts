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

  private async generateHMACv2(timestamp: number, token: string, resourceType: string, actionId: string): Promise<string> {
    // HMAC v2 calculation as per onOffice documentation
    const message = `${timestamp}${token}${resourceType}${actionId}`;
    
    console.log('HMAC v2 message:', message);
    
    const key = new TextEncoder().encode(this.secret);
    const messageBytes = new TextEncoder().encode(message);
    
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      key,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageBytes);
    const base64Signature = btoa(String.fromCharCode(...new Uint8Array(signature)));
    
    console.log('Generated HMAC v2:', base64Signature);
    return base64Signature;
  }

  async makeRequest(config: OnOfficeConfig) {
    const timestamp = Math.floor(Date.now() / 1000);
    
    // Create the action data structure
    const actionData = {
      actionid: config.actionId,
      resourceid: config.resourceId || '',
      resourcetype: config.resourceType,
      identifier: config.identifier || '',
      timestamp: timestamp,
      hmac_version: 2,
      parameters: config.parameters || {}
    };

    // Generate HMAC v2
    const hmac = await this.generateHMACv2(
      timestamp, 
      this.token, 
      config.resourceType, 
      config.actionId
    );
    
    actionData.hmac = hmac;

    // Create the complete request structure as per onOffice documentation
    const requestData = {
      token: this.token,
      request: {
        actions: [actionData]
      }
    };

    console.log('Making onOffice API request:', {
      actionId: config.actionId,
      resourceType: config.resourceType,
      timestamp,
      parameters: config.parameters
    });

    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('onOffice API full response:', JSON.stringify(result, null, 2));
    
    // Check for API errors
    if (result.status && result.status.code !== 200) {
      console.error('onOffice API error:', result.status);
      throw new Error(`onOffice API error: ${result.status.message || 'Unknown error'} (Code: ${result.status.code})`);
    }
    
    // Check for action-level errors - be more careful about undefined values
    if (result.response && result.response.results && result.response.results[0]) {
      const actionResult = result.response.results[0];
      console.log('Action result status:', actionResult.status);
      
      if (actionResult.status && actionResult.status.code && actionResult.status.code !== 200) {
        console.error('onOffice action error:', actionResult.status);
        throw new Error(`onOffice action error: ${actionResult.status.message || 'Unknown error'} (Code: ${actionResult.status.code})`);
      }
    }
    
    return result;
  }

  // Get real estate listings with configurable fields
  async getEstates(parameters = {}) {
    // Standard basic fields that most onOffice systems have
    // Using the exact field names from your working n8n workflow
    const basicFields = [
      'Id',
      'objekttitel',
      'vermarktungsart',
      'wohnflaeche', 
      'anzahl_zimmer',
      'ort',
      'kaufpreis',
      'kaltmiete',
      'warmmiete',
      'objektbeschreibung',
      'status',
      'verkauft',
      'reserviert'
    ];

    return this.makeRequest({
      token: this.token,
      secret: this.secret,
      actionId: 'urn:onoffice-de-ns:smart:2.5:smartml:action:read',
      resourceType: 'estate',
      parameters: {
        data: basicFields,
        listlimit: 20,
        filter: {
          status: [{ op: '=', val: 1 }] // Only active properties
        },
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
    console.log('Request data:', JSON.stringify(requestData, null, 2));

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
        // Test connection with the most basic request possible - no parameters
        result = await api.makeRequest({
          token: token,
          secret: secret,
          actionId: 'urn:onoffice-de-ns:smart:2.5:smartml:action:read',
          resourceType: 'estate',
          parameters: {}
        });
        break;
      
      default:
        throw new Error(`Unknown action: ${action}`);
    }

    console.log('API result parsed:', JSON.stringify(result, null, 2));

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