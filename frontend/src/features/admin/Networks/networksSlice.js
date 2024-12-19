import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getToken } from "../../../utils/helpers";

export const fetchAllNetworks = createAsyncThunk(
  "networks/fetchAllNetworks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/admin/networks", {
        headers: {
          Authorization: `${getToken()}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const createNetwork = createAsyncThunk(
  "networks/create",
  async (networkData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/admin/networks", networkData, {
        headers: {
          Authorization: `${getToken()}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateNetwork = createAsyncThunk(
  "networks/update",
  async ({ id, data }, { rejectWithValue }) => {
    console.log(data);
    try {
      const response = await axios.put(`/api/admin/networks/${id}`, data, {
        headers: {
          Authorization: `${getToken()}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteNetwork = createAsyncThunk(
  "networks/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/admin/networks/${id}`, {
        headers: {
          Authorization: `${getToken()}`,
        },
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const networksSlice = createSlice({
  name: "networks",
  initialState: { networks: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch All Networks
      .addCase(fetchAllNetworks.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAllNetworks.fulfilled, (state, action) => {
        state.networks = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchAllNetworks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch networks.";
      })
      // Create Network
      .addCase(createNetwork.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createNetwork.fulfilled, (state, action) => {
        state.networks.push(action.payload);
        state.status = "succeeded";
      })
      .addCase(createNetwork.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to create network.";
      })
      // Update Network
      .addCase(updateNetwork.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateNetwork.fulfilled, (state, action) => {
        const index = state.networks.findIndex(
          (network) => network._id === action.payload._id
        );
        state.networks[index] = action.payload;
        state.status = "succeeded";
      })
      .addCase(updateNetwork.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to update network.";
      })
      // Delete Network
      .addCase(deleteNetwork.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteNetwork.fulfilled, (state, action) => {
        state.networks = state.networks.filter(
          (network) => network._id !== action.payload
        );
        state.status = "succeeded";
      })
      .addCase(deleteNetwork.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to delete network.";
      });
  },
});

export default networksSlice.reducer;
