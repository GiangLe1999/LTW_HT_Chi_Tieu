import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title 
} from 'chart.js';
import { Pie, Line } from 'react-chartjs-2';
import { format } from 'date-fns';

ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title
);

const categoryMapping = {
  "Food": "Ăn uống",
  "Transport": "Di chuyển",
  "Rent": "Tiền thuê nhà",
  "Entertainment": "Giải trí",
  "Utilities": "Tiện ích",
  "Health": "Sức khỏe",
  "Shopping": "Mua sắm",
  "Others": "Khác"
};

const getCategoryLabel = (id) => {
  if (!id) return "Khác";
  // Try direct match, then lowercase match
  if (categoryMapping[id]) return categoryMapping[id];
  
  const entries = Object.entries(categoryMapping);
  const found = entries.find(([key]) => key.toLowerCase() === id.toLowerCase());
  return found ? found[1] : id;
};

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalSpent: 0,
    monthlySpent: 0,
    budget: 0,
    remaining: 0
  });
  const [categoryData, setCategoryData] = useState({ labels: [], datasets: [] });
  const [monthlyData, setMonthlyData] = useState({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(true);

  const currentMonth = format(new Date(), 'yyyy-MM');

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [categoryRes, monthlyRes, budgetRes, expensesRes] = await Promise.all([
        api.get('/analytics/category'),
        api.get('/analytics/monthly'),
        api.get(`/budgets/${currentMonth}`),
        api.get('/expenses')
      ]);

      // Calculate stats
      const totalSpent = expensesRes.data.reduce((sum, exp) => sum + exp.amount, 0);
      const currentMonthRecord = monthlyRes.data.find(item => item._id === currentMonth);
      const monthlySpent = currentMonthRecord ? currentMonthRecord.totalAmount : 0;
      const budget = budgetRes.data ? budgetRes.data.amount : 0;
      
      setStats({
        totalSpent,
        monthlySpent,
        budget,
        remaining: budget - monthlySpent
      });

      // Prepare Category Chart Data
      const categories = categoryRes.data;
      setCategoryData({
        labels: categories.map(c => getCategoryLabel(c._id)),
        datasets: [{
          data: categories.map(c => c.totalAmount),
          backgroundColor: [
            '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#6366f1', '#14b8a6'
          ],
          borderWidth: 0,
        }]
      });

      // Prepare Monthly Chart Data
      const monthly = monthlyRes.data;
      setMonthlyData({
        labels: monthly.map(m => m._id),
        datasets: [{
          label: 'Chi tiêu',
          data: monthly.map(m => m.totalAmount),
          borderColor: '#0f172a',
          backgroundColor: 'rgba(15, 23, 42, 0.05)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#0f172a',
          borderWidth: 2,
        }]
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [currentMonth]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <div className="text-center py-20 text-slate-500">Đang tải dữ liệu tổng quan...</div>;

  return (
    <div className="space-y-8">
      {/* Text-focused Header */}
      <div>
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Tổng quan tài chính</h3>
      </div>

      {/* Quick Stats - No Icons, Typography Focused */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Tổng chi tiêu" 
          amount={stats.totalSpent} 
        />
        <StatCard 
          title="Chi tiêu tháng này" 
          amount={stats.monthlySpent} 
        />
        <StatCard 
          title="Ngân sách tháng" 
          amount={stats.budget} 
        />
        <StatCard 
          title="Ngân sách còn lại" 
          amount={stats.remaining} 
          amountColor={stats.remaining < 0 ? 'text-red-600' : 'text-emerald-600'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Spending Trend Chart */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Xu hướng chi tiêu</h3>
              <p className="text-sm text-slate-500 mt-1">{monthlyData.labels.length} tháng gần nhất</p>
            </div>
          </div>
          <div className="h-64 w-full mt-auto">
            <Line 
              data={monthlyData} 
              options={{ 
                maintainAspectRatio: false,
                scales: {
                  y: { 
                    beginAtZero: true, 
                    grid: { color: '#f1f5f9', drawBorder: false },
                    ticks: { font: { family: "'Inter', sans-serif", size: 11 } }
                  },
                  x: { 
                    grid: { display: false, drawBorder: false },
                    ticks: { font: { family: "'Inter', sans-serif", size: 11 } }
                  }
                },
                plugins: { legend: { display: false } }
              }} 
            />
          </div>
        </div>

        {/* Category Breakdown Chart */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Phân bổ danh mục</h3>
              <p className="text-sm text-slate-500 mt-1">Tỉ lệ chi tiêu theo từng nhóm</p>
            </div>
          </div>
          <div className="h-64 w-full flex justify-center mt-auto">
            <Pie 
              data={categoryData} 
              options={{ 
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right',
                    labels: {
                      usePointStyle: true,
                      padding: 24,
                      font: { family: "'Inter', sans-serif", size: 12, weight: '500' }
                    }
                  }
                }
              }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, amount, amountColor = 'text-slate-900' }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transition-shadow hover:shadow-md">
    <p className="text-sm text-slate-500 font-medium mb-3">{title}</p>
    <p className={`text-3xl font-bold tracking-tight ${amountColor}`}>
      {amount.toLocaleString('vi-VN')} <span className="text-lg font-semibold text-slate-400 ml-1">đ</span>
    </p>
  </div>
);

export default Dashboard;
