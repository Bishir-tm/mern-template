import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch users
export const fetchUsers = createAsyncThunk(
  "admin/fetchUsers",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get("/api/admin/users", {
        headers: {
          Authorization: `${token}`,
        },
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default adminSlice.reducer;
