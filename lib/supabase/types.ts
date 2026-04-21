export type Database = {
  public: {
    Tables: {
      teams: {
        Row: {
          id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          created_at?: string;
        };
        Relationships: [];
      };
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
        Insert: {
          name: string;
          avatar: string;
          color?: string;
          role?: string;
          email: string;
          active?: boolean;
          team_id: string;
        };
        Update: {
          name?: string;
          avatar?: string;
          color?: string;
          role?: string;
          email?: string;
          active?: boolean;
          team_id?: string;
        };
        Relationships: [];
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
        Insert: {
          rep_id: number;
          amount: number;
          deal_count: number;
          avg_ticket: number;
          conversion: number;
          new_clients: number;
          period: string;
          period_start: string;
          team_id: string;
        };
        Update: {
          rep_id?: number;
          amount?: number;
          deal_count?: number;
          avg_ticket?: number;
          conversion?: number;
          new_clients?: number;
          period?: string;
          period_start?: string;
          team_id?: string;
        };
        Relationships: [];
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
        Insert: {
          team_id: string;
          weekly: number;
          monthly: number;
          quarterly: number;
          yearly: number;
          deal_target: number;
          conv_target: number;
        };
        Update: {
          team_id?: string;
          weekly?: number;
          monthly?: number;
          quarterly?: number;
          yearly?: number;
          deal_target?: number;
          conv_target?: number;
        };
        Relationships: [];
      };
      badges: {
        Row: {
          id: number;
          rep_id: number;
          badge_id: string;
          team_id: string;
          awarded_at: string;
        };
        Insert: {
          rep_id: number;
          badge_id: string;
          team_id: string;
        };
        Update: {
          rep_id?: number;
          badge_id?: string;
          team_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      rep_sales_summary: {
        Row: {
          rep_id: number;
          team_id: string;
          name: string;
          avatar: string;
          color: string;
          role: string;
          active: boolean;
          week_sales: number;
          month_sales: number;
          quarter_sales: number;
          year_sales: number;
          deals: number;
          avg_ticket: number;
          conversion: number;
          new_clients: number;
        };
        Relationships: [];
      };
    };
    Functions: Record<string, never>;
  };
};

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];

export type Views<T extends keyof Database['public']['Views']> =
  Database['public']['Views'][T]['Row'];

export type Rep = Tables<'reps'>;
export type Sale = Tables<'sales'>;
export type Target = Tables<'targets'>;
export type Badge = Tables<'badges'>;
export type Team = Tables<'teams'>;
export type RepSummary = Views<'rep_sales_summary'>;
