import { supabase } from '../lib/supabaseClient'
import { Book } from './mockData'

// Helper function để map snake_case từ Supabase sang camelCase
const mapBookFromSupabase = (data: any): Book => ({
  id: data.id,
  code: data.code,
  title: data.title,
  author: data.author,
  categoryId: data.category_id,
  totalQuantity: data.total_quantity,
  availableQuantity: data.available_quantity,
  isHidden: data.is_hidden
})

export const booksApi = {
  getAll: async (): Promise<Book[]> => {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .order('title')
    
    if (error) throw error
    return data.map(mapBookFromSupabase)
  },

  getById: async (id: string): Promise<Book | null> => {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) return null
    return mapBookFromSupabase(data)
  },

  create: async (book: Omit<Book, 'id'>): Promise<Book> => {
    const { data, error } = await supabase
      .from('books')
      .insert([{
        code: book.code,
        title: book.title,
        author: book.author,
        category_id: book.categoryId,
        total_quantity: book.totalQuantity,
        available_quantity: book.availableQuantity,
        is_hidden: book.isHidden
      }])
      .select()
      .single()
    
    if (error) throw error
    return mapBookFromSupabase(data)
  },

  update: async (id: string, updates: Partial<Book>): Promise<Book> => {
    const updateData: any = {}
    if (updates.code !== undefined) updateData.code = updates.code
    if (updates.title !== undefined) updateData.title = updates.title
    if (updates.author !== undefined) updateData.author = updates.author
    if (updates.categoryId !== undefined) updateData.category_id = updates.categoryId
    if (updates.totalQuantity !== undefined) updateData.total_quantity = updates.totalQuantity
    if (updates.availableQuantity !== undefined) updateData.available_quantity = updates.availableQuantity
    if (updates.isHidden !== undefined) updateData.is_hidden = updates.isHidden
    
    const { data, error } = await supabase
      .from('books')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return mapBookFromSupabase(data)
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  search: async (query: string): Promise<Book[]> => {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .or(`title.ilike.%${query}%,author.ilike.%${query}%`)
    
    if (error) throw error
    return data.map(mapBookFromSupabase)
  }
}
