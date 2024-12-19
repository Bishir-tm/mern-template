// src/features/dashboard/dashboardSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Define initial state
const initialState = {
  profile: null,
  balance: null,
  transactions: [],
  loading: false,
  error: null,
};

// Async thunk to fetch dashboard data
export const fetchDashboardData = createAsyncThunk(
  "dashboard/fetchDashboardData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/dashboard"); // Adjust to your backend route
      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create the dashboard slice
const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload.profile;
        state.balance = action.payload.balance;
        state.transactions = action.payload.transactions;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default dashboardSlice.reducer;
