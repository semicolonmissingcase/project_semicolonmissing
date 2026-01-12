/**
 * @file src/store/thunks/banksThunk.js
 * @description banks Thunk
 * 260112 yh init
 */

import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance.js";

const getBanksThunk = createAsyncThunk(
  'banks/getBanksThunk',
  async (_, { rejectWithValue }) => {
    try {
      const url = '/api/banks';
      const response = await axiosInstance.get(url);

      return response.data;
    } catch (error) {

      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export default {
  getBanksThunk,
}