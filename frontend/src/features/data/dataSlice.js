import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async Thunks

// Fetch Networks
export const fetchNetworks = createAsyncThunk(
  "data/fetchNetworks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/networks", {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch Data Types by Network
export const fetchDataTypes = createAsyncThunk(
  "data/fetchDataTypes",
  async (networkId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/data/types/${networkId}`, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data[0]; // Assuming the API returns an array
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch Data Plans by Data Type
export const fetchDataPlans = createAsyncThunk(
  "data/fetchDataPlans",
  async ({ networkId, dataType }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/data/plans`, {
        params: { networkId, dataType }, // Pass both as query parameters
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Perform Data Purchase
export const purchaseData = createAsyncThunk(
  "data/purchaseData",
  async ({ phone, networkId, planId, amount }, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        "/api/data/purchase",
        { phone, networkId, planId, amount },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      return response.data; // The backend should return transaction details
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Slice
const dataSlice = createSlice({
  name: "data",
  initialState: {
    networks: [],
    dataTypes: [],
    dataPlans: [],
    transaction: null, // For storing the result of a successful data purchase
    loading: {
      networks: false,
      dataTypes: false,
      dataPlans: false,
      purchase: false,
    },
    error: null,
  },
  reducers: {
    clearTransaction(state) {
      state.transaction = null; // Reset transaction details
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Networks
      .addCase(fetchNetworks.pending, (state) => {
        state.loading.networks = true;
        state.error = null;
      })
      .addCase(fetchNetworks.fulfilled, (state, action) => {
        state.loading.networks = false;
        state.networks = action.payload;
      })
      .addCase(fetchNetworks.rejected, (state, action) => {
        state.loading.networks = false;
        state.error = action.payload;
      })

      // Fetch Data Types
      .addCase(fetchDataTypes.pending, (state) => {
        state.loading.dataTypes = true;
        state.error = null;
      })
      .addCase(fetchDataTypes.fulfilled, (state, action) => {
        state.loading.dataTypes = false;
        state.dataTypes = action.payload;
      })
      .addCase(fetchDataTypes.rejected, (state, action) => {
        state.loading.dataTypes = false;
        state.error = action.payload;
      })

      // Fetch Data Plans
      .addCase(fetchDataPlans.pending, (state) => {
        state.loading.dataPlans = true;
        state.error = null;
      })
      .addCase(fetchDataPlans.fulfilled, (state, action) => {
        state.loading.dataPlans = false;
        state.dataPlans = action.payload;
      })
      .addCase(fetchDataPlans.rejected, (state, action) => {
        state.loading.dataPlans = false;
        state.error = action.payload;
      })

      // Perform Data Purchase
      .addCase(purchaseData.pending, (state) => {
        state.loading.purchase = true;
        state.error = null;
      })
      .addCase(purchaseData.fulfilled, (state, action) => {
        state.loading.purchase = false;
        state.transaction = action.payload;
      })
      .addCase(purchaseData.rejected, (state, action) => {
        state.loading.purchase = false;
        state.error = action.payload;
      });
  },
});

// Export Actions and Red ucer
export const { clearTransaction } = dataSlice.actions;
export default dataSlice.reducer;
