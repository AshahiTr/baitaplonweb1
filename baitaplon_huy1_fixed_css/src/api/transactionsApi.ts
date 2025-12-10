import { supabase } from '../lib/supabaseClient'
import { Transaction } from './mockData'

const mapTransactionFromSupabase = (data: any): Transaction => ({
  id: data.id,
  readerId: data.reader_id,
  bookId: data.book_id,
  borrowDate: data.borrow_date,
  dueDate: data.due_date,
  returnDate: data.return_date,
  status: data.status,
  overdueNote: data.overdue_note,
  createdAt: data.created_at,
  approvedAt: data.approved_at,
  requestedBy: data.requested_by
})

export const transactionsApi = {
  getAll: async (): Promise<Transaction[]> => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data.map(mapTransactionFromSupabase)
  },

  getPending: async (): Promise<Transaction[]> => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching pending transactions:', error)
      throw error
    }
    return data ? data.map(mapTransactionFromSupabase) : []
  },

  getById: async (id: string): Promise<Transaction | null> => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) return null
    return mapTransactionFromSupabase(data)
  },

  create: async (transaction: Omit<Transaction, 'id' | 'createdAt'>): Promise<Transaction> => {
    const { data, error } = await supabase
      .from('transactions')
      .insert([{
        reader_id: transaction.readerId,
        book_id: transaction.bookId,
        borrow_date: transaction.borrowDate,
        due_date: transaction.dueDate,
        return_date: transaction.returnDate,
        status: transaction.status,
        overdue_note: transaction.overdueNote,
        approved_at: transaction.approvedAt,
        requested_by: transaction.requestedBy
      }])
      .select()
      .single()
    
    if (error) throw error
    return mapTransactionFromSupabase(data)
  },

  update: async (id: string, updates: Partial<Transaction>): Promise<Transaction> => {
    const updateData: any = {}
    if (updates.returnDate !== undefined) updateData.return_date = updates.returnDate
    if (updates.status !== undefined) updateData.status = updates.status
    if (updates.overdueNote !== undefined) updateData.overdue_note = updates.overdueNote
    if (updates.approvedAt !== undefined) updateData.approved_at = updates.approvedAt
    
    const { data, error } = await supabase
      .from('transactions')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return mapTransactionFromSupabase(data)
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  getByReader: async (readerId: string): Promise<Transaction[]> => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('reader_id', readerId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data.map(mapTransactionFromSupabase)
  }
}