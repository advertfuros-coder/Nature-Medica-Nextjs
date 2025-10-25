import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  stats: {
    totalSales: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0
  },
  loading: false
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setStats: (state, action) => {
      state.stats = action.payload;
    },
    
    setLoading: (state, action) => {
      state.loading = action.payload;
    }
  }
});

export const { setStats, setLoading } = adminSlice.actions;
export default adminSlice.reducer;
