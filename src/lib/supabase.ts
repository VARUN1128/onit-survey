import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { SurveySubmissionPayload, SurveyRecord } from '../types/survey';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl && 
    supabaseAnonKey && 
    supabaseUrl.startsWith('https://') &&
    supabaseUrl !== 'https://your-project.supabase.co'
  );
};

// Singleton supabase client instance
let supabaseInstance: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
  if (!isSupabaseConfigured()) {
    return null;
  }
  if (!supabaseInstance && supabaseUrl && supabaseAnonKey) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return supabaseInstance;
};

export interface SubmitResponseResult {
  success: boolean;
  error?: string;
  data?: unknown;
  isMock?: boolean;
}

// Sample responses for initial demonstration when DB is not yet populated
export const DEMO_SURVEY_RECORDS: SurveyRecord[] = [
  {
    id: 'demo-1',
    name: 'Aswin Kumar',
    age: 32,
    location: 'Kochi, Kerala',
    occupation: 'Product Designer',
    currently_uses_services: 'Yes',
    required_services: ['Plumbing', 'House cleaning', 'AC service', 'Other'],
    other_service: 'Smart home automation',
    service_frequency: 'Monthly',
    provider_discovery_methods: ['Google Search', 'Friends and Family', 'Other'],
    other_discovery_method: 'Neighbourhood WhatsApp group',
    interested_in_online_platform: 'Yes',
    booking_challenges: ['Finding trusted professionals', 'Lack of availability', 'No transparent pricing'],
    service_provider_criteria: {
      'Verified and trusted professionals': 'Extremely Important',
      'Affordable pricing': 'Very Important',
      'Transparent pricing': 'Extremely Important',
      'Quality of service': 'Extremely Important',
      'Quick availability': 'Very Important',
      'On-time service': 'Extremely Important',
      'Customer support': 'Very Important',
    },
    would_use_onit: 'Yes',
    referral_name: 'Dr. Sandeep Nair',
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: 'demo-2',
    name: 'Devika Menon',
    age: 28,
    location: 'Trivandrum',
    occupation: 'Software Engineer',
    currently_uses_services: 'Sometimes',
    required_services: ['House cleaning', 'Electrical', 'Appliance repair'],
    other_service: null,
    service_frequency: 'Once every 3–6 months',
    provider_discovery_methods: ['Google Search', 'Online platforms / apps'],
    other_discovery_method: null,
    interested_in_online_platform: 'Yes',
    booking_challenges: ['Delayed responses', 'No transparent pricing', 'High service charges'],
    service_provider_criteria: {
      'Verified and trusted professionals': 'Extremely Important',
      'Affordable pricing': 'Important',
      'Transparent pricing': 'Extremely Important',
      'Quality of service': 'Extremely Important',
      'Quick availability': 'Important',
      'On-time service': 'Very Important',
      'Customer support': 'Important',
    },
    would_use_onit: 'Yes',
    referral_name: 'Anjali R.',
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    id: 'demo-3',
    name: 'Lijin Thomas',
    age: 41,
    location: 'Kozhikode',
    occupation: 'Civil Engineer',
    currently_uses_services: 'Yes',
    required_services: ['Painting', 'Carpenter', 'Electrical', 'Gardening'],
    other_service: null,
    service_frequency: 'Weekly',
    provider_discovery_methods: ['Local service providers', 'Friends and Family'],
    other_discovery_method: null,
    interested_in_online_platform: 'Maybe',
    booking_challenges: ['Finding trusted professionals', 'Poor service quality'],
    service_provider_criteria: {
      'Verified and trusted professionals': 'Extremely Important',
      'Affordable pricing': 'Important',
      'Transparent pricing': 'Very Important',
      'Quality of service': 'Extremely Important',
      'Quick availability': 'Very Important',
      'On-time service': 'Extremely Important',
      'Customer support': 'Very Important',
    },
    would_use_onit: 'Yes',
    referral_name: 'Mathew George',
    created_at: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
  },
];

/**
 * Inserts a customer survey response into Supabase table 'customer_interest_surveys'
 */
export async function submitSurveyResponse(payload: SurveySubmissionPayload): Promise<SubmitResponseResult> {
  const client = getSupabaseClient();

  if (!client) {
    // If Supabase credentials are not configured yet, notify with clear actionable message
    return {
      success: false,
      error: 'Supabase credentials are not configured in your environment. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file to store responses.',
      isMock: true,
    };
  }

  try {
    const { data, error } = await client
      .from('customer_interest_surveys')
      .insert([
        {
          name: payload.name.trim(),
          age: payload.age,
          location: payload.location ? payload.location.trim() : null,
          occupation: payload.occupation.trim(),
          currently_uses_services: payload.currently_uses_services,
          required_services: payload.required_services,
          other_service: payload.other_service ? payload.other_service.trim() : null,
          service_frequency: payload.service_frequency,
          provider_discovery_methods: payload.provider_discovery_methods,
          other_discovery_method: payload.other_discovery_method ? payload.other_discovery_method.trim() : null,
          interested_in_online_platform: payload.interested_in_online_platform,
          booking_challenges: payload.booking_challenges,
          service_provider_criteria: payload.service_provider_criteria,
          would_use_onit: payload.would_use_onit,
          referral_name: payload.referral_name.trim(),
        },
      ]);

    if (error) {
      console.error('Supabase survey insertion error:', error);
      return {
        success: false,
        error: error.message || 'Failed to submit response to the database. Please try again.',
      };
    }

    return {
      success: true,
      data,
    };
  } catch (err: unknown) {
    console.error('Unexpected error while submitting survey:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'A network error occurred. Please check your connection and try again.',
    };
  }
}

export interface FetchResponsesResult {
  records: SurveyRecord[];
  isLive: boolean;
  error?: string;
}

/**
 * Fetches all survey responses from Supabase table 'customer_interest_surveys'
 */
export async function fetchSurveyResponses(): Promise<FetchResponsesResult> {
  const client = getSupabaseClient();

  if (!client) {
    return {
      records: DEMO_SURVEY_RECORDS,
      isLive: false,
      error: 'Supabase credentials not configured in .env. Showing sample customer response records for preview.',
    };
  }

  try {
    const { data, error } = await client
      .from('customer_interest_surveys')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch error:', error);
      return {
        records: DEMO_SURVEY_RECORDS,
        isLive: false,
        error: `Supabase query error: ${error.message}. Displaying sample records.`,
      };
    }

    if (!data || data.length === 0) {
      return {
        records: [],
        isLive: true,
      };
    }

    return {
      records: data as SurveyRecord[],
      isLive: true,
    };
  } catch (err: unknown) {
    console.error('Failed to fetch survey responses:', err);
    return {
      records: DEMO_SURVEY_RECORDS,
      isLive: false,
      error: err instanceof Error ? err.message : 'Failed to connect to Supabase database.',
    };
  }
}
