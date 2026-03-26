import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import Button from '../components/Button';
import Input from '../components/Input';
import { format } from 'date-fns';

const Budget = () => {
  const currentMonth = format(new Date(), 'yyyy-MM');
  const [budget, setBudget] = useState(0);
  const [spent, setSpent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [newBudget, setNewBudget] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      const budgetRes = await api.get(`/budgets/${currentMonth}`);
      if (budgetRes.data) {
        setBudget(budgetRes.data.amount);
        setNewBudget(budgetRes.data.amount.toString());
      }

      const analyticsRes = await api.get('/analytics/monthly');
      const currentMonthData = analyticsRes.data.find(item => item._id === currentMonth);
      setSpent(currentMonthData ? currentMonthData.totalAmount : 0);
      
    } catch (error) {
      console.error('Error fetching budget data:', error);
    } finally {
      setLoading(false);
    }
  }, [currentMonth]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUpdateBudget = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/budgets', {
        amount: Number(newBudget),
        month: currentMonth
      });
      setBudget(data.amount);
      setMessage({ type: 'success', text: 'Đã cập nhật ngân sách thành công!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error updating budget:', error);
      setMessage({ type: 'error', text: 'Cập nhật thất bại. Vui lòng thử lại.' });
    }
  };

  const remaining = budget - spent;
  const percentSpent = budget > 0 ? (spent / budget) * 100 : 0;
  const isOverBudget = spent > budget && budget > 0;

  if (loading) return <div className="text-center py-20 text-slate-500">Đang tải thông tin ngân sách...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500 font-medium mb-3">Ngân sách tháng</p>
          <p className="text-3xl font-bold tracking-tight text-slate-900">
            {budget.toLocaleString('vi-VN')} <span className="text-lg font-semibold text-slate-400 ml-1">đ</span>
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500 font-medium mb-3">Đã chi tiêu</p>
          <p className={`text-3xl font-bold tracking-tight ${isOverBudget ? 'text-red-600' : 'text-slate-900'}`}>
            {spent.toLocaleString('vi-VN')} <span className="text-lg font-semibold text-slate-400 ml-1">đ</span>
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500 font-medium mb-3">Số dư khả dụng</p>
          <p className={`text-3xl font-bold tracking-tight ${remaining < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
            {remaining.toLocaleString('vi-VN')} <span className="text-lg font-semibold text-slate-400 ml-1">đ</span>
          </p>
        </div>
      </div>

      {/* Progress & Alert */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
        <div className="flex items-end justify-between mb-2">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Tiến độ chi tiêu</h3>
            <p className="text-sm text-slate-500 mt-1">Tháng {format(new Date(), 'MM/yyyy')}</p>
          </div>
          <span className={`text-2xl font-bold tracking-tight ${percentSpent > 90 ? 'text-red-600' : 'text-slate-900'}`}>
            {percentSpent.toFixed(1)}%
          </span>
        </div>
        
        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ease-out rounded-full ${
              percentSpent > 100 ? 'bg-red-500' : percentSpent > 80 ? 'bg-amber-400' : 'bg-blue-600'
            }`}
            style={{ width: `${Math.min(percentSpent, 100)}%` }}
          ></div>
        </div>

        {isOverBudget && (
          <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-100/50">
            <p className="text-sm font-medium">
              Bạn đã chi tiêu vượt ngân sách <strong>{Math.abs(remaining).toLocaleString('vi-VN')} đ</strong>. Hãy điều chỉnh lại kế hoạch chi tiêu.
            </p>
          </div>
        )}

        {budget > 0 && !isOverBudget && percentSpent > 80 && (
          <div className="p-4 bg-amber-50 text-amber-800 rounded-xl border border-amber-100/50">
            <p className="text-sm font-medium">
              Lưu ý: Bạn đã sử dụng <strong>{percentSpent.toFixed(1)}%</strong> ngân sách của tháng này.
            </p>
          </div>
        )}
      </div>

      {/* Set Budget Form */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 max-w-md">
        <h3 className="text-lg font-bold text-slate-900 mb-6">Thiết lập ngân sách</h3>
        <form onSubmit={handleUpdateBudget} className="space-y-5">
          <Input
            label="Nhập số tiền"
            isCurrency={true}
            placeholder="0"
            value={newBudget}
            onChange={(e) => setNewBudget(e.target.value)}
            required
          />
          <button 
            type="submit" 
            className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-medium transition-colors text-sm shadow-sm"
          >
            Lưu ngân sách
          </button>
          
          {message.text && (
            <div className={`text-center text-sm font-medium p-3 rounded-xl ${
              message.type === 'success' ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50'
            }`}>
              {message.text}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Budget;
