import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Input from '../components/Input';
import Select from '../components/Select';
import { format } from 'date-fns';

const DebtTracker = () => {
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    personName: '',
    amount: '',
    type: 'Debt',
    dueDate: format(new Date(), 'yyyy-MM-dd'),
    notes: ''
  });

  const fetchDebts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/debts');
      setDebts(data);
    } catch (error) {
      console.error('Error fetching debts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDebts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/debts', formData);
      fetchDebts();
      setIsModalOpen(false);
      setFormData({ personName: '', amount: '', type: 'Debt', dueDate: format(new Date(), 'yyyy-MM-dd'), notes: '' });
    } catch (error) {
      console.error('Error creating debt record:', error);
    }
  };

  const handleToggleStatus = async (debt) => {
    try {
      const newStatus = debt.status === 'Pending' ? 'Paid' : 'Pending';
      await api.put(`/debts/${debt._id}`, { status: newStatus });
      fetchDebts();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bản ghi này?')) {
      try {
        await api.delete(`/debts/${id}`);
        fetchDebts();
      } catch (error) {
        console.error('Error deleting debt record:', error);
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Ghi chú nợ & Cho vay</h3>
          <p className="text-slate-400 text-sm font-medium">Quản lý các khoản tiền cần trả hoặc cần thu hồi</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl font-medium transition-colors text-sm shadow-sm"
        >
          + Thêm bản ghi mới
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Người liên quan</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Loại</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Số tiền</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Hạn thanh toán</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500 text-sm">Đang tải dữ liệu...</td>
                </tr>
              ) : debts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500 text-sm">Không có dữ liệu nợ hoặc cho vay.</td>
                </tr>
              ) : (
                debts.map((debt) => (
                  <tr key={debt._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-slate-900">{debt.personName}</div>
                      {debt.notes && <div className="text-xs text-slate-500 mt-0.5">{debt.notes}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-lg text-xs font-bold ${debt.type === 'Debt' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                        {debt.type === 'Debt' ? 'Tôi nợ' : 'Họ nợ'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">
                      {debt.amount.toLocaleString('vi-VN')} đ
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {debt.dueDate ? format(new Date(debt.dueDate), 'dd/MM/yyyy') : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => handleToggleStatus(debt)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          debt.status === 'Paid' 
                            ? 'bg-slate-100 text-slate-400 line-through' 
                            : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                        }`}
                      >
                        {debt.status === 'Paid' ? 'Đã hoàn tất' : 'Đang chờ'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(debt._id)}
                        className="text-xs font-bold text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Thêm bản ghi nợ/cho vay">
        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <Input 
            label="Tên người liên quan" 
            placeholder="vd: Anh Tuấn, Chị Hoa..." 
            value={formData.personName}
            onChange={(e) => setFormData({...formData, personName: e.target.value})}
            required 
          />
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Số tiền" 
              isCurrency={true}
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              required 
            />
            <Select 
              label="Loại hình"
              options={[
                { label: 'Tôi nợ họ', value: 'Debt' },
                { label: 'Họ nợ tôi', value: 'Loan' }
              ]}
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              required
            />
          </div>
          <Input 
            label="Hạn thanh toán (Tùy chọn)" 
            type="date" 
            value={formData.dueDate}
            onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
          />
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Ghi chú</label>
            <textarea
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-shadow resize-none"
              rows="3"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
            ></textarea>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" className="flex-1 py-3 px-4 bg-slate-100 text-slate-700 font-bold rounded-xl text-sm" onClick={() => setIsModalOpen(false)}>Hủy</button>
            <button type="submit" className="flex-1 py-3 px-4 bg-slate-900 text-white font-bold rounded-xl text-sm">Lưu bản ghi</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DebtTracker;
