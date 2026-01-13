import { createAsyncThunk } from "@reduxjs/toolkit";
import { cancelReservation } from "../../api/axiosOwner.js";

export const cancelEstimateThunk = createAsyncThunk(
  'estimate/cancel',
  async (estimateId, { rejectWithValue }) => {
    try {
      const response = await cancelReservation(estimateId);
      return { ...response.data, estimateId };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);