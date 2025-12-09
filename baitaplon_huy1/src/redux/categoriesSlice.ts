import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Category } from '../api/mockData';
import { categoriesApi } from '../api/categoriesApi';

interface CategoriesState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoriesState = {
  categories: [],
  loading: false,
  error: null,
};

export const fetchCategories = createAsyncThunk('categories/fetchAll', async () => {
  return await categoriesApi.getAll();
});

export const createCategory = createAsyncThunk(
  'categories/create',
  async (categoryData: Omit<Category, "id">) => {
    return await categoriesApi.create(categoryData);
  }
);

export const updateCategory = createAsyncThunk(
  'categories/update',
  async ({ id, name }: { id: string; name: string }) => {
    return await categoriesApi.update(id, { name });
  }
);

export const deleteCategory = createAsyncThunk(
  'categories/delete',
  async (id: string) => {
    await categoriesApi.delete(id);
    return id;
  }
);

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(c => c.id !== action.payload);
      });
  },
});

export default categoriesSlice.reducer;
