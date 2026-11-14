import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { SurveySubmissionPayload } from '../types/survey';

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
