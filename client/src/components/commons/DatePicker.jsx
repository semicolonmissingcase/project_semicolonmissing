
import React from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./DatePicker.css";

export default function DatePicker({ 
  selected, 
  onChange, 
  minDate = new Date(new Date().setDate(new Date().getDate() + 1)),
  maxDate = null,
  dateFormat = "yyyy-MM-dd",
  placeholderText = "날짜 선택",
  className = "",
  disabled = false
}) {
  return (
    <ReactDatePicker
      selected={selected}
      onChange={onChange}
      minDate={minDate}
      maxDate={maxDate}
      dateFormat={dateFormat}
      placeholderText={placeholderText}
      className={className}
      disabled={disabled}
    />
  );
}