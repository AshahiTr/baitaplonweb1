import { supabase } from '../lib/supabaseClient'
import { User } from './mockData'

const mapUserFromSupabase = (data: any): User => ({
  id: data.id,
  email: data.email,
  password: data.password || '',
  fullName: data.full_name,
  phone: data.phone,
  role: data.role,
  quota: data.quota,
  currentBorrowing: data.current_borrowing,
  penaltyStatus: data.penalty_status,
  createdAt: data.created_at
})

export const usersApi = {
  getAll: async (): Promise<User[]> => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data.map(mapUserFromSupabase)
  },

  getById: async (id: string): Promise<User | null> => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) return null
    return mapUserFromSupabase(data)
  },

  create: async (userData: Omit<User, 'id' | 'createdAt'>): Promise<User> => {
    const { data, error } = await supabase
      .from('users')
      .insert([{
        email: userData.email,
        password: userData.password,
        full_name: userData.fullName,
        phone: userData.phone,
        role: userData.role,
        quota: userData.quota,
        current_borrowing: userData.currentBorrowing,
        penalty_status: userData.penaltyStatus
      }])
      .select()
      .single()
    
    if (error) throw error
    return mapUserFromSupabase(data)
  },

  update: async (id: string, updates: Partial<User>): Promise<User> => {
    const updateData: any = {}
    if (updates.fullName !== undefined) updateData.full_name = updates.fullName
    if (updates.phone !== undefined) updateData.phone = updates.phone
    if (updates.quota !== undefined) updateData.quota = updates.quota
    if (updates.currentBorrowing !== undefined) updateData.current_borrowing = updates.currentBorrowing
    if (updates.penaltyStatus !== undefined) updateData.penalty_status = updates.penaltyStatus
    
    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return mapUserFromSupabase(data)
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  login: async (email: string, password: string): Promise<User> => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error || !data) throw new Error('Invalid credentials')
    return mapUserFromSupabase(data)
  }
}
