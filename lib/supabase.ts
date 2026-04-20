import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      reps: {
        Row: {
          id: number;
          name: string;
          avatar: string;
          color: string;
          role: string;
          email: string;
          active: boolean;
          team_id: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['reps']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['reps']['Insert']>;
      };
      sales: {
        Row: {
          id: number;
          rep_id: number;
          amount: number;
          deal_count: number;
          avg_ticket: number;
          conversion: number;
          new_clients: number;
          period: string;
          period_start: string;
          team_id: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['sales']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['sales']['Insert']>;
      };
      targets: {
        Row: {
          id: number;
          team_id: string;
          weekly: number;
          monthly: number;
          quarterly: number;
          yearly: number;
          deal_target: number;
          conv_target: number;
        };
        Insert: Omit<Database['public']['Tables']['targets']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['targets']['Insert']>;
      };
      badges: {
        Row: {
          id: number;
          rep_id: number;
          badge_id: string;
          team_id: string;
          awarded_at: string;
        };
        Insert: Omit<Database['public']['Tables']['badges']['Row'], 'id' | 'awarded_at'>;
        Update: Partial<Database['public']['Tables']['badges']['Insert']>;
      };
    };
  };
};
