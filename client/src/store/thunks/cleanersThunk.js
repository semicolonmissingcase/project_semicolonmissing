import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance.js";

const locationThunk = createAsyncThunk(
  'cleaners/locationThunk',
  async (_, { rejectWithValue }) => {
    try {
      const url = '/api/users/cleaner'; 
      const response = await axiosInstance.get(url);
      

      return response.data.rows; 
    } catch (error) {

      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const titleThunk = createAsyncThunk(
  'cleaners/titleThunk',
  async (_, { rejectWithValue }) => { 
    try {

      const url = `/api/owners/quotations`; 
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const showThunk = createAsyncThunk(
  'cleaners/showThunk',
  async (id, { rejectWithValue }) => {
    try {
      
      const url = `/api/owners/quotations/${id}`;

      const response = await axiosInstance.get(url);

      return response.data;
    } catch (error) {
      
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const fetchAccounts = createAsyncThunk(
  'cleaners/fetchAccounts',
  async (cleanerId, { rejectWithValue }) => {
    try {
      
      const response = await axiosInstance.get(`/api/users/cleaner/accountinfo/${cleanerId}`);
      
      
      return response.data.data.rows; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.msg || "계좌 정보를 불러오지 못했습니다.");
    }
  }
);


export default {
  locationThunk,
  titleThunk,
  showThunk,        
  fetchAccounts, 
};