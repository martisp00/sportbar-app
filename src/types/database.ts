export type Database = {
  public: {
    Tables: {
      bars: {
        Row: {
          id: string
          owner_id: string
          name: string
          slug: string
          address: string
          city: string
          logo_url: string | null
          description: string | null
          phone: string | null
          location: string | null
          created_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          name: string
          slug: string
          address: string
          city: string
          logo_url?: string | null
          description?: string | null
          phone?: string | null
          location?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          name?: string
          slug?: string
          address?: string
          city?: string
          logo_url?: string | null
          description?: string | null
          phone?: string | null
          location?: string | null
          created_at?: string
        }
      }
      sports_catalog: {
        Row: {
          id: string
          name: string
          icon_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          icon_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          icon_url?: string | null
          created_at?: string
        }
      }
      sports_events: {
        Row: {
          id: string
          bar_id: string
          sport_id: string
          title: string
          starts_at: string
          ends_at: string | null
          screen_count: number | null
          notes: string | null
          is_recurring: boolean
          created_at: string
        }
        Insert: {
          id?: string
          bar_id: string
          sport_id: string
          title: string
          starts_at: string
          ends_at?: string | null
          screen_count?: number | null
          notes?: string | null
          is_recurring?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          bar_id?: string
          sport_id?: string
          title?: string
          starts_at?: string
          ends_at?: string | null
          screen_count?: number | null
          notes?: string | null
          is_recurring?: boolean
          created_at?: string
        }
      }
      bar_schedules: {
        Row: {
          id: string
          bar_id: string
          sport_id: string
          day_of_week: number
          opens_at: string
          closes_at: string
          created_at: string
        }
        Insert: {
          id?: string
          bar_id: string
          sport_id: string
          day_of_week: number
          opens_at: string
          closes_at: string
          created_at?: string
        }
        Update: {
          id?: string
          bar_id?: string
          sport_id?: string
          day_of_week?: number
          opens_at?: string
          closes_at?: string
          created_at?: string
        }
      }
    }
  }
}

export type Bar = Database['public']['Tables']['bars']['Row']
export type SportsCatalog = Database['public']['Tables']['sports_catalog']['Row']
export type SportsEvent = Database['public']['Tables']['sports_events']['Row']
export type BarSchedule = Database['public']['Tables']['bar_schedules']['Row']
