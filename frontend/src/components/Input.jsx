import React from "react";
import DatePicker from "react-datepicker";
import { format, parseISO, isValid } from "date-fns";
import { vi } from "date-fns/locale";

const Input = ({ label, error, icon, isCurrency, value, onChange, ...props }) => {
  
  // Hàm định dạng số tiền để hiển thị
  const formatCurrency = (val) => {
    if (val === "" || val === undefined || val === null) return "";
    const stringValue = val.toString();
    return stringValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleChange = (e) => {
    if (isCurrency) {
      // Chỉ lấy số
      const rawValue = e.target.value.replace(/\D/g, "");
      if (onChange) {
        onChange({
          ...e,
          target: { ...e.target, name: props.name, value: rawValue },
        });
      }
    } else if (onChange) {
      onChange(e);
    }
  };

  const handleDateChange = (date) => {
    if (onChange) {
      const formattedDate = date ? format(date, "yyyy-MM-dd") : "";
      onChange({
        target: { name: props.name, value: formattedDate },
      });
    }
  };

  const renderInput = () => {
    if (props.type === "date") {
      const dateValue = value ? parseISO(value) : null;
      return (
        <DatePicker
          selected={isValid(dateValue) ? dateValue : null}
          onChange={handleDateChange}
          dateFormat="dd/MM/yyyy"
          locale={vi}
          placeholderText="Ngày/Tháng/Năm"
          className={`w-full ${
            icon ? "pl-10" : "px-4"
          } py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none ${
            error ? "border-red-500 bg-red-50" : "border-gray-200"
          } ${props.className || ""}`}
          autoComplete="off"
        />
      );
    }

    return (
      <input
        {...props}
        type={isCurrency ? "text" : props.type}
        // Nếu là tiền tệ thì dùng hàm format, nếu không dùng trực tiếp value từ props
        value={isCurrency ? formatCurrency(value) : (value || "")}
        onChange={handleChange}
        className={`w-full ${
          icon ? "pl-10" : "px-4"
        } py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none ${
          error ? "border-red-500 bg-red-50" : "border-gray-200"
        } ${props.className || ""}`}
      />
    );
  };

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none">
            {icon}
          </div>
        )}
        {renderInput()}
        {isCurrency && value && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold pointer-events-none">
            VNĐ
          </div>
        )}
      </div>
      {error && <p className="mt-1.5 text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
};

export default Input;
