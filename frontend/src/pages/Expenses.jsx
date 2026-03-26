import React, { useState, useEffect } from "react";
import api from "../services/api";
import Button from "../components/Button";
import Modal from "../components/Modal";
import Input from "../components/Input";
import Select from "../components/Select";
import { format } from "date-fns";

const categories = [
  { label: "Tất cả danh mục", value: "" },
  { label: "Ăn uống", value: "Food" },
  { label: "Di chuyển", value: "Transport" },
  { label: "Tiền thuê nhà", value: "Rent" },
  { label: "Giải trí", value: "Entertainment" },
  { label: "Tiện ích", value: "Utilities" },
  { label: "Sức khỏe", value: "Health" },
  { label: "Mua sắm", value: "Shopping" },
  { label: "Khác", value: "Others" },
];

const formCategories = categories.filter((c) => c.value !== "");

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentExpense, setCurrentExpense] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterDate, setFilterDate] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "Food",
    date: format(new Date(), "yyyy-MM-dd"),
    notes: "",
  });

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/expenses");
      setExpenses(data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleOpenModal = (expense = null) => {
    if (expense) {
      setCurrentExpense(expense);
      setFormData({
        title: expense.title,
        amount: expense.amount,
        category: expense.category,
        date: format(new Date(expense.date), "yyyy-MM-dd"),
        notes: expense.notes || "",
      });
    } else {
      setCurrentExpense(null);
      setFormData({
        title: "",
        amount: "",
        category: "Food",
        date: format(new Date(), "yyyy-MM-dd"),
        notes: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentExpense(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentExpense) {
        await api.put(`/expenses/${currentExpense._id}`, formData);
      } else {
        await api.post("/expenses", formData);
      }
      fetchExpenses();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving expense:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa khoản chi tiêu này không?')) {
      try {
        await api.delete(`/expenses/${id}`);
        fetchExpenses();
      } catch (error) {
        console.error('Error deleting expense:', error);
      }
    }
  };

  const handleExportCSV = async () => {
    try {
      const response = await api.get('/expenses/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Bao_cao_chi_tieu_${format(new Date(), 'ddMMyyyy')}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Xuất file thất bại. Vui lòng thử lại.');
    }
  };

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "" || expense.category === filterCategory;
    const matchesDate =
      filterDate === "" ||
      format(new Date(expense.date), "yyyy-MM-dd") === filterDate;
    return matchesSearch && matchesCategory && matchesDate;
  });

  return (
    <div className="space-y-8">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex-1 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="Tìm kiếm chi tiêu..."
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm min-w-[160px]"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            <div className="w-[160px]">
              <Input
                type="date"
                className="!mb-0 !py-2.5 !border-gray-200 bg-white !rounded-xl !text-sm"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                placeholder="Chọn ngày..."
              />
            </div>
          </div>
          </div>
          <div className="flex gap-3">
          <button 
            onClick={handleExportCSV}
            className="px-6 py-2.5 bg-white border border-gray-200 text-slate-600 hover:bg-slate-50 rounded-xl font-medium transition-colors text-sm shadow-sm whitespace-nowrap"
          >
            Xuất báo cáo CSV
          </button>
          <button 
            onClick={() => handleOpenModal()} 
            className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl font-medium transition-colors text-sm shadow-sm whitespace-nowrap"
          >
            + Thêm khoản chi mới
          </button>
          </div>
          </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Ngày
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Mô tả
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Phân loại
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                  Số tiền
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-12 text-center text-slate-500 text-sm"
                  >
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : filteredExpenses.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-12 text-center text-slate-500 text-sm"
                  >
                    Chưa có khoản chi nào phù hợp.
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((expense) => (
                  <tr
                    key={expense._id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">
                      {format(new Date(expense.date), "dd/MM/yyyy")}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-slate-900">
                        {expense.title}
                      </div>
                      {expense.notes && (
                        <div className="text-xs text-slate-500 mt-0.5">
                          {expense.notes}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700">
                        {categories.find((c) => c.value === expense.category)
                          ?.label || expense.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-900 text-right">
                      {expense.amount.toLocaleString("vi-VN")} đ
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenModal(expense)}
                          className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(expense._id)}
                          className="text-xs font-semibold text-red-600 hover:text-red-800 transition-colors"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={currentExpense ? "Cập nhật khoản chi" : "Tạo khoản chi mới"}
      >
        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <Input
            label="Mô tả chi tiêu"
            placeholder="vd: Tiền điện tháng 3, Đi siêu thị..."
            required
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Số tiền"
              isCurrency={true}
              placeholder="0"
              required
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
            />
            <Select
              label="Phân loại"
              options={formCategories}
              required
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            />
          </div>
          <Input
            label="Ngày giao dịch"
            type="date"
            required
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Ghi chú thêm
            </label>
            <textarea
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-shadow resize-none"
              rows="3"
              placeholder="Nhập ghi chú nếu có..."
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
            ></textarea>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl text-sm transition-colors"
              onClick={handleCloseModal}
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl text-sm transition-colors shadow-sm"
            >
              {currentExpense ? "Lưu thay đổi" : "Hoàn tất thêm"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Expenses;
