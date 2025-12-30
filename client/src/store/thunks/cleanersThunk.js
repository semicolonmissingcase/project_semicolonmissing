import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance.js";

const showThunk = createAsyncThunk(
  'cleaners/showThunk',
  async (id, { rejectWithValue }) => {
    try {
      const url = `/api/owners/quotations/${id}`;

      const response = await axiosInstance.get(url); 

      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export default {
  showThunk,
}