import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getToken } from "../../../utils/helpers";

const initialState = {
  users: [],
  status: "idle", // idle | loading | succeeded | failed
  error: null,
};

// Thunks
export const fetchAllUsers = createAsyncThunk(
  "users/fetchAll",
  async (_, { rejectWithValue }) => {
    console.log("called");

    try {
      const response = await axios.get("/api/admin/users", {
        headers: {
          Authorization: `${getToken()}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch users");
    }
  }
);

export const createUser = createAsyncThunk(
  "users/create",
  async (user, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/admin/users", user, {
        headers: {
          Authorization: `${getToken()}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to create user");
    }
  }
);

export const updateUser = createAsyncThunk(
  "users/update",
  async ({ id, user }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/admin/users/${id}`, user, {
        headers: {
          Authorization: `${getToken()}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update user");
    }
  }
);

export const deleteUser = createAsyncThunk(
  "users/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/admin/users/${id}`, {
        headers: {
          Authorization: `${getToken()}`,
        },
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete user");
    }
  }
);

// Slice
const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = "loading";
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.users = action.payload.data;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload;
      })
      // Create
      .addCase(createUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Update
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(
          (user) => user._id === action.payload._id
        );
        if (index >= 0) {
          state.users[index] = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Delete
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user._id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default usersSlice.reducer;
