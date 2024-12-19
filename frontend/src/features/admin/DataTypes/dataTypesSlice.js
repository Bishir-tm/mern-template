import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getToken } from "../../../utils/helpers";

const initialState = {
  dataTypes: [],
  loading: "idle", // idle | loading | succeeded | failed
  error: null,
};

// Thunks
export const fetchAllDataTypes = createAsyncThunk(
  "dataTypes/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/admin/datatypes", {
        headers: {
          Authorization: `${getToken()}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch data types"
      );
    }
  }
);

export const createDataType = createAsyncThunk(
  "dataTypes/create",
  async (dataType, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/admin/datatypes", dataType, {
        headers: {
          Authorization: `${getToken()}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to create data type"
      );
    }
  }
);

export const updateDataType = createAsyncThunk(
  "dataTypes/update",
  async ({ id, dataType }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/admin/datatypes/${id}`, dataType, {
        headers: {
          Authorization: `${getToken()}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update data type"
      );
    }
  }
);

export const deleteDataType = createAsyncThunk(
  "dataTypes/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/admin/datatypes/${id}`, {
        headers: {
          Authorization: `${getToken()}`,
        },
      });
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to delete data type"
      );
    }
  }
);

// Slice
const dataTypesSlice = createSlice({
  name: "dataTypes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchAllDataTypes.pending, (state) => {
        state.loading = "loading";
        state.error = null;
      })
      .addCase(fetchAllDataTypes.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.dataTypes = action.payload;
      })
      .addCase(fetchAllDataTypes.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload;
      })
      // Create
      .addCase(createDataType.fulfilled, (state, action) => {
        state.dataTypes.push(action.payload);
      })
      .addCase(createDataType.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Update
      .addCase(updateDataType.fulfilled, (state, action) => {
        const index = state.dataTypes.findIndex(
          (item) => item._id === action.payload._id
        );
        if (index >= 0) {
          state.dataTypes[index] = action.payload;
        }
      })
      .addCase(updateDataType.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Delete
      .addCase(deleteDataType.fulfilled, (state, action) => {
        state.dataTypes = state.dataTypes.filter(
          (item) => item._id !== action.payload
        );
      })
      .addCase(deleteDataType.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default dataTypesSlice.reducer;
