import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Input from '../components/Input';
import { format, differenceInDays } from 'date-fns';

const SavingGoals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [currentGoal, setCurrentGoal] = useState(null);
  const [updateAmount, setUpdateAmount] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '0',
    deadline: format(new Date(), 'yyyy-MM-dd')
  });

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/goals');
      setGoals(data);
    } catch (error) {
      console.error('Error fetching goals:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/goals', formData);
      fetchGoals();
      setIsModalOpen(false);
      setFormData({ name: '', targetAmount: '', currentAmount: '0', deadline: format(new Date(), 'yyyy-MM-dd') });
    } catch (error) {
      console.error('Error creating goal:', error);
    }
  };

  const handleUpdateAmount = async (e) => {
    e.preventDefault();
    try {
      const newCurrentAmount = Number(currentGoal.currentAmount) + Number(updateAmount);
      await api.put(`/goals/${currentGoal._id}`, { currentAmount: newCurrentAmount });
      fetchGoals();
      setIsUpdateModalOpen(false);
      setUpdateAmount('');
    } catch (error) {
      console.error('Error updating goal:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa mục tiêu này?')) {
      try {
        await api.delete(`/goals/${id}`);
        fetchGoals();
      } catch (error) {
        console.error('Error deleting goal:', error);
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Kế hoạch tích lũy</h3>
          <p className="text-slate-400 text-sm font-medium">Theo dõi các mục tiêu tài chính của bạn</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl font-medium transition-colors text-sm shadow-sm"
        >
          + Tạo mục tiêu mới
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {loading ? (
          <div className="col-span-full py-20 text-center text-slate-500">Đang tải danh sách mục tiêu...</div>
        ) : goals.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-dashed border-slate-200 text-slate-400">
            Bạn chưa có mục tiêu tiết kiệm nào. Hãy tạo ngay một cái!
          </div>
        ) : (
          goals.map((goal) => {
            const progress = (goal.currentAmount / goal.targetAmount) * 100;
            const daysLeft = differenceInDays(new Date(goal.deadline), new Date());
            
            return (
              <div key={goal._id} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6 relative group">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 mb-1">{goal.name}</h4>
                    <p className="text-sm text-slate-500">Hạn chót: {format(new Date(goal.deadline), 'dd/MM/yyyy')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                      {daysLeft > 0 ? `Còn ${daysLeft} ngày` : 'Đã đến hạn'}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-end text-sm">
                    <p className="font-semibold text-slate-600">
                      {goal.currentAmount.toLocaleString('vi-VN')} <span className="text-slate-400">/ {goal.targetAmount.toLocaleString('vi-VN')} đ</span>
                    </p>
                    <span className="font-bold text-blue-600 text-lg">{progress.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 transition-all duration-1000" 
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex gap-4 pt-2">
                  <button 
                    onClick={() => { setCurrentGoal(goal); setIsUpdateModalOpen(true); }}
                    className="flex-1 py-2 text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                  >
                    Góp thêm tiền
                  </button>
                  <button 
                    onClick={() => handleDelete(goal._id)}
                    className="px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors opacity-0 group-hover:opacity-100"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal tạo mới */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Mục tiêu tiết kiệm mới">
        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <Input 
            label="Tôi đang tiết kiệm để..." 
            placeholder="vd: Mua iPhone 15, Đi Đà Lạt..." 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required 
          />
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Số tiền cần có" 
              isCurrency={true}
              value={formData.targetAmount}
              onChange={(e) => setFormData({...formData, targetAmount: e.target.value})}
              required 
            />
            <Input 
              label="Số tiền hiện có" 
              isCurrency={true}
              value={formData.currentAmount}
              onChange={(e) => setFormData({...formData, currentAmount: e.target.value})}
            />
          </div>
          <Input 
            label="Ngày dự kiến đạt được" 
            type="date" 
            value={formData.deadline}
            onChange={(e) => setFormData({...formData, deadline: e.target.value})}
            required 
          />
          <div className="flex gap-3 pt-2">
            <button type="button" className="flex-1 py-3 px-4 bg-slate-100 text-slate-700 font-bold rounded-xl text-sm" onClick={() => setIsModalOpen(false)}>Hủy</button>
            <button type="submit" className="flex-1 py-3 px-4 bg-slate-900 text-white font-bold rounded-xl text-sm">Bắt đầu tiết kiệm</button>
          </div>
        </form>
      </Modal>

      {/* Modal cập nhật tiến độ */}
      <Modal isOpen={isUpdateModalOpen} onClose={() => setIsUpdateModalOpen(false)} title={`Góp tiền cho: ${currentGoal?.name}`}>
        <form onSubmit={handleUpdateAmount} className="space-y-6 mt-4">
          <Input 
            label="Nhập số tiền bạn vừa tiết kiệm được" 
            isCurrency={true}
            value={updateAmount}
            onChange={(e) => setUpdateAmount(e.target.value)}
            required 
            autoFocus
          />
          <div className="flex gap-3">
            <button type="button" className="flex-1 py-3 px-4 bg-slate-100 text-slate-700 font-bold rounded-xl text-sm" onClick={() => setIsUpdateModalOpen(false)}>Đóng</button>
            <button type="submit" className="flex-1 py-3 px-4 bg-blue-600 text-white font-bold rounded-xl text-sm">Xác nhận góp tiền</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SavingGoals;
