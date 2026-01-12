/**
 * @file src/store/thunks/adminInquiryThunk.js
 */
import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance.js";

const adminInquiryThunk = {
  /**
   * 문의 목록 및 통계 데이터 조회
   * @param {string} search - 검색어 (추가)
   */
  getInquiryListThunk: createAsyncThunk(
    "adminInquiry/getList",
    async (search = "", { getState, rejectWithValue }) => {
      try {
        const { page, offset } = getState().adminPagination;
        
        const response = await axiosInstance.get(`/api/admin/inquiries`, {
          params: { 
            page, 
            limit: offset, 
            type: '1:1',
            search: search
          }
        });
        
        return response.data; 
      } catch (error) {
        return rejectWithValue(error.response?.data || "데이터 조회에 실패했습니다.");
      }
    }
  ),

  /**
   * 문의 상세 데이터 조회
   */
  getInquiryDetailThunk: createAsyncThunk(
    "adminInquiry/getDetail",
    async (inquiryId, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.get(`/api/admin/inquiries/${inquiryId}`);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data || "상세 정보를 불러오는데 실패했습니다.");
      }
    }
  ),

  /**
   * 문의 답변 등록
   */
  postInquiryReplyThunk: createAsyncThunk(
    "adminInquiry/postReply",
    async ({ inquiryId, content }, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.post(`/api/admin/inquiries/${inquiryId}/reply`, {
          content
        });
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data || "답변 등록에 실패했습니다.");
      }
    }
  )
};

export default adminInquiryThunk;