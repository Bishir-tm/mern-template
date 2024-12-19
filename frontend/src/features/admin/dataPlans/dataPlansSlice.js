import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getToken } from "../../../utils/helpers";

// Async thunks
export const fetchAllDataPlans = createAsyncThunk(
  "dataPlans/fetchAllDataPlans",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/admin/dataplans", {
        headers: {
          Authorization: `${getToken()}`,
        },
      });
      return response.data.dataPlans;
    } catch (error) {
      console.log(error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch data plans"
      );
    }
  }
);

export const createDataPlan = createAsyncThunk(
  "dataPlans/createDataPlan",
  async (dataPlan, { rejectWithValue }) => {
    console.log(dataPlan);
    try {
      const response = await axios.post("/api/admin/dataplans", dataPlan, {
        headers: {
          Authorization: `${getToken()}`,
        },
      });
      return response.data.dataPlan;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create data plan"
      );
    }
  }
);

export const updateDataPlan = createAsyncThunk(
  "dataPlans/updateDataPlan",
  async (dataPlan, { rejectWithValue }) => {
    try {
      console.log(dataPlan);
      const response = await axios.put(
        `/api/admin/dataplans/${dataPlan.id}`,
        dataPlan,
        {
          headers: {
            Authorization: `${getToken()}`,
          },
        }
      );
      return response.data.dataPlan;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update data plan"
      );
    }
  }
);

export const deleteDataPlan = createAsyncThunk(
  "dataPlans/deleteDataPlan",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/admin/dataplans/${id}`, {
        headers: {
          Authorization: `${getToken()}`,
        },
      });
      return id; // Return the deleted ID to update the state
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete data plan"
      );
    }
  }
);

// Slice
const dataPlansSlice = createSlice({
  name: "dataPlans",
  initialState: {
    dataPlans: [],
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Data Plans
      .addCase(fetchAllDataPlans.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllDataPlans.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.dataPlans = action.payload;
      })
      .addCase(fetchAllDataPlans.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Create Data Plan
      .addCase(createDataPlan.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createDataPlan.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.dataPlans.push(action.payload);
      })
      .addCase(createDataPlan.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Update Data Plan
      .addCase(updateDataPlan.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateDataPlan.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.dataPlans.findIndex(
          (plan) => plan._id === action.payload._id
        );
        if (index !== -1) {
          state.dataPlans[index] = action.payload;
        }
      })
      .addCase(updateDataPlan.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Delete Data Plan
      .addCase(deleteDataPlan.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteDataPlan.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.dataPlans = state.dataPlans.filter(
          (plan) => plan._id !== action.payload
        );
      })
      .addCase(deleteDataPlan.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default dataPlansSlice.reducer;
