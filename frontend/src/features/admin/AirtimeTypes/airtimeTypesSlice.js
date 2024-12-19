import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getToken } from "../../../utils/helpers";

const initialState = {
  airtimeTypes: [],
  loading: "idle", // idle | loading | succeeded | failed
  error: null,
};

// Thunks
export const fetchAllAirtimeTypes = createAsyncThunk(
  "airtimeTypes/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/admin/airtimetypes", {
        headers: {
          Authorization: `${getToken()}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch airtime types"
      );
    }
  }
);

export const createAirtimeType = createAsyncThunk(
  "airtimeTypes/create",
  async (airtimeType, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "/api/admin/airtimetypes",
        airtimeType,
        {
          headers: {
            Authorization: `${getToken()}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to create airtime type"
      );
    }
  }
);

export const updateAirtimeType = createAsyncThunk(
  "airtimeTypes/update",
  async ({ id, airtimeType }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `/api/admin/airtimetypes/${id}`,
        airtimeType,
        {
          headers: {
            Authorization: `${getToken()}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update airtime type"
      );
    }
  }
);

export const deleteAirtimeType = createAsyncThunk(
  "airtimeTypes/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/admin/airtimetypes/${id}`, {
        headers: {
          Authorization: `${getToken()}`,
        },
      });
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to delete airtime type"
      );
    }
  }
);

// Slice
const airtimeTypesSlice = createSlice({
  name: "airtimeTypes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchAllAirtimeTypes.pending, (state) => {
        state.loading = "loading";
        state.error = null;
      })
      .addCase(fetchAllAirtimeTypes.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.airtimeTypes = action.payload;
      })
      .addCase(fetchAllAirtimeTypes.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload;
      })
      // Create
      .addCase(createAirtimeType.fulfilled, (state, action) => {
        state.airtimeTypes.push(action.payload);
      })
      .addCase(createAirtimeType.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Update
      .addCase(updateAirtimeType.fulfilled, (state, action) => {
        const index = state.airtimeTypes.findIndex(
          (item) => item._id === action.payload._id
        );
        if (index >= 0) {
          state.airtimeTypes[index] = action.payload;
        }
      })
      .addCase(updateAirtimeType.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Delete
      .addCase(deleteAirtimeType.fulfilled, (state, action) => {
        state.airtimeTypes = state.airtimeTypes.filter(
          (item) => item._id !== action.payload
        );
      })
      .addCase(deleteAirtimeType.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default airtimeTypesSlice.reducer;
