import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || ''
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
})

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          phone: string | null
          role: 'admin' | 'reader'
          quota: number
          current_borrowing: number
          penalty_status: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['users']['Insert']>
      }
      books: {
        Row: {
          id: string
          code: string
          title: string
          author: string
          category_id: string | null
          total_quantity: number
          available_quantity: number
          is_hidden: boolean
        }
      }
      categories: {
        Row: {
          id: string
          name: string
        }
      }
      transactions: {
        Row: {
          id: string
          reader_id: string
          book_id: string
          borrow_date: string
          due_date: string
          return_date: string | null
          status: 'pending' | 'borrowing' | 'overdue' | 'returned'
          overdue_note: string
          approved_at: string | null
          requested_by: 'admin' | 'reader'
          created_at: string
        }
      }
    }
  }
}