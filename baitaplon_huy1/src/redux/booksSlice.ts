import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Book } from '../api/mockData';
import { booksApi } from '../api/booksApi';

interface BooksState {
  books: Book[];
  loading: boolean;
  error: string | null;
}

const initialState: BooksState = {
  books: [],
  loading: false,
  error: null,
};

export const fetchBooks = createAsyncThunk('books/fetchAll', async () => {
  return await booksApi.getAll();
});

export const createBook = createAsyncThunk(
  'books/create',
  async (book: Omit<Book, 'id'>) => {
    return await booksApi.create(book);
  }
);

export const updateBook = createAsyncThunk(
  'books/update',
  async ({ id, updates }: { id: string; updates: Partial<Book> }) => {
    return await booksApi.update(id, updates);
  }
);

export const deleteBook = createAsyncThunk('books/delete', async (id: string) => {
  await booksApi.delete(id);
  return id;
});

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch books';
      })
      .addCase(createBook.fulfilled, (state, action) => {
        state.books.push(action.payload);
      })
      .addCase(updateBook.fulfilled, (state, action) => {
        const index = state.books.findIndex(b => b.id === action.payload.id);
        if (index !== -1) {
          state.books[index] = action.payload;
        }
      })
      .addCase(deleteBook.fulfilled, (state, action) => {
        state.books = state.books.filter(b => b.id !== action.payload);
      });
  },
});

export default booksSlice.reducer;
