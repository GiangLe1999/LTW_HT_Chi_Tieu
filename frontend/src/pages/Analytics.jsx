import React, { useState, useEffect } from 'react';
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
  BarElement,
  Title 
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  Title
);

const Analytics = () => {
  const [categoryData, setCategoryData] = useState({ labels: [], datasets: [] });
  const [monthlyData, setMonthlyData] = useState({ labels: [], datasets: [] });
  const [insights, setInsights] = useState({
    avgSpending: 0,
    highestCategory: { name: '', amount: 0 },
    lastMonthGrowth: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [categoryRes, monthlyRes] = await Promise.all([
        api.get('/analytics/category'),
        api.get('/analytics/monthly')
      ]);

      const categories = categoryRes.data;
      const monthly = monthlyRes.data;

      // Category Data
      setCategoryData({
        labels: categories.map(c => c._id),
        datasets: [{
          label: 'Tổng chi tiêu',
          data: categories.map(c => c.totalAmount),
          backgroundColor: [
            '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#6366f1', '#14b8a6'
          ],
          borderColor: 'transparent',
          borderWidth: 0,
        }]
      });

      // Monthly Data
      setMonthlyData({
        labels: monthly.map(m => m._id),
        datasets: [
          {
            type: 'line',
            label: 'Xu hướng',
            data: monthly.map(m => m.totalAmount),
            borderColor: '#0f172a',
            borderWidth: 2,
            fill: false,
            tension: 0.4,
            pointBackgroundColor: '#0f172a',
          },
          {
            type: 'bar',
            label: 'Chi tiêu',
            data: monthly.map(m => m.totalAmount),
            backgroundColor: 'rgba(15, 23, 42, 0.05)',
            borderRadius: 4,
          }
        ]
      });

      // Calculate Insights
      if (monthly.length > 0) {
        const total = monthly.reduce((sum, m) => sum + m.totalAmount, 0);
        const avg = total / monthly.length;
        
        let lastMonthGrowth = 0;
        if (monthly.length >= 2) {
          const last = monthly[monthly.length - 1].totalAmount;
          const prev = monthly[monthly.length - 2].totalAmount;
          lastMonthGrowth = ((last - prev) / prev) * 100;
        }

        const highest = categories.reduce((prev, current) => 
          (prev.totalAmount > current.totalAmount) ? prev : current
        , { _id: 'Chưa có dữ liệu', totalAmount: 0 });

        setInsights({
          avgSpending: avg,
          highestCategory: { name: highest._id, amount: highest.totalAmount },
          lastMonthGrowth
        });
      }

    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <div className="text-center py-20 text-slate-500">Đang phân tích dữ liệu...</div>;

  return (
    <div className="space-y-8">
      {/* Text-focused Header */}
      <div>
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Báo cáo chi tiết</h3>
      </div>

      {/* Insights Cards - Typography Focused */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500 font-medium mb-3">Trung bình mỗi tháng</p>
          <p className="text-3xl font-bold tracking-tight text-slate-900">
            {insights.avgSpending.toLocaleString('vi-VN', { maximumFractionDigits: 0 })} <span className="text-lg font-semibold text-slate-400 ml-1">đ</span>
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500 font-medium mb-3">Chi nhiều nhất cho</p>
          <p className="text-2xl font-bold tracking-tight text-slate-900 truncate">
            {insights.highestCategory.name}
          </p>
          <p className="text-sm font-medium text-slate-400 mt-1">
            {insights.highestCategory.amount.toLocaleString('vi-VN')} đ
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500 font-medium mb-3">So với tháng trước</p>
          <p className={`text-3xl font-bold tracking-tight ${insights.lastMonthGrowth > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
            {insights.lastMonthGrowth > 0 ? '+' : ''}{insights.lastMonthGrowth.toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Detailed Monthly Trend */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <div className="mb-8">
            <h3 className="text-lg font-bold text-slate-900">Tổng quan chi tiêu</h3>
            <p className="text-sm text-slate-500 mt-1">Phân tích dòng tiền hàng tháng</p>
          </div>
          <div className="h-96">
            <Bar 
              data={monthlyData} 
              options={{ 
                maintainAspectRatio: false,
                scales: {
                  y: { 
                    beginAtZero: true,
                    grid: { color: '#f1f5f9', drawBorder: false },
                    ticks: { 
                      font: { family: "'Inter', sans-serif" },
                      callback: (value) => value.toLocaleString('vi-VN') + ' đ' 
                    }
                  },
                  x: { grid: { display: false, drawBorder: false } }
                },
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: { usePointStyle: true, padding: 24, font: { family: "'Inter', sans-serif" } }
                  }
                }
              }} 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Detailed Category Distribution */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full">
            <div className="mb-8">
              <h3 className="text-lg font-bold text-slate-900">Tỉ trọng danh mục</h3>
              <p className="text-sm text-slate-500 mt-1">Cấu trúc chi tiêu của bạn</p>
            </div>
            <div className="h-80 mt-auto">
              <Pie 
                data={categoryData} 
                options={{ 
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right',
                      labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: { family: "'Inter', sans-serif", size: 13, color: '#475569' }
                      }
                    }
                  }
                }} 
              />
            </div>
          </div>

          {/* Quick Tips/Insights */}
          <div className="bg-slate-900 p-8 rounded-2xl shadow-lg border border-slate-800 text-white flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold tracking-tight mb-8">Góc nhìn thông minh</h3>
              
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Trọng tâm chi tiêu</p>
                  <p className="text-lg leading-relaxed text-slate-200">Khoản chi lớn nhất của bạn nằm ở <strong>{insights.highestCategory.name}</strong>. Hãy cân nhắc xem mức chi này có hợp lý với kế hoạch của bạn không.</p>
                </div>
                
                <div className="h-px w-full bg-slate-800"></div>

                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Đánh giá xu hướng</p>
                  <p className="text-lg leading-relaxed text-slate-200">
                    {insights.lastMonthGrowth > 0 
                      ? "Chi tiêu của bạn đang có dấu hiệu tăng lên so với tháng trước. Đừng quên kiểm tra lại ngân sách."
                      : "Dấu hiệu rất tốt! Bạn đang tiết kiệm hiệu quả hơn so với tháng trước."}
                  </p>
                </div>
              </div>
            </div>
            <p className="text-sm text-slate-500 mt-12 font-medium">
              Dữ liệu được cập nhật theo thời gian thực.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
