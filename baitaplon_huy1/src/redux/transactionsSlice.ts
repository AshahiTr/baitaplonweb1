import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Transaction } from '../api/mockData';
import { transactionsApi } from '../api/transactionsApi';

interface TransactionsState {
  transactions: Transaction[];
  pending: Transaction[];
  loading: boolean;
  error: string | null;
}

const initialState: TransactionsState = {
  transactions: [],
  pending: [],
  loading: false,
  error: null,
};

export const fetchTransactions = createAsyncThunk('transactions/fetchAll', async () => {
  return await transactionsApi.getAll();
});

export const fetchPendingTransactions = createAsyncThunk(
  'transactions/fetchPending',
  async () => {
    return await transactionsApi.getPending();
  }
);

export const createTransaction = createAsyncThunk(
  'transactions/create',
  async (data: Omit<Transaction, 'id' | 'createdAt'>) => {
    return await transactionsApi.create(data);
  }
);

export const updateTransaction = createAsyncThunk(
  'transactions/update',
  async ({ id, updates }: { id: string; updates: Partial<Transaction> }) => {
    return await transactionsApi.update(id, updates);
  }
);

export const deleteTransaction = createAsyncThunk(
  'transactions/delete',
  async (id: string) => {
    await transactionsApi.delete(id);
    return id;
  }
);

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all transactions
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch transactions';
      })
      // Fetch pending transactions
      .addCase(fetchPendingTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPendingTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.pending = action.payload;
      })
      .addCase(fetchPendingTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch pending transactions';
      })
      // Create transaction
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.transactions.push(action.payload);
        if (action.payload.status === 'pending') {
          state.pending.push(action.payload);
        }
      })
      // Update transaction
      .addCase(updateTransaction.fulfilled, (state, action) => {
        const index = state.transactions.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.transactions[index] = action.payload;
        }
        // Remove from pending if status changed
        if (action.payload.status !== 'pending') {
          state.pending = state.pending.filter(t => t.id !== action.payload.id);
        }
      })
      // Delete transaction
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.transactions = state.transactions.filter(t => t.id !== action.payload);
        state.pending = state.pending.filter(t => t.id !== action.payload);
      });
  },
});

export default transactionsSlice.reducer;