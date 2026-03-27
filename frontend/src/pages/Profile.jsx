import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/useAuth';
import api from '../services/api';
import Input from '../components/Input';
import { format } from 'date-fns';

const Profile = () => {
  const { user, login } = useAuth();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    createdAt: ''
  });
  const [passwords, setPasswords] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || '',
        email: user.email || '',
        createdAt: user.createdAt || new Date().toISOString()
      });
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.put('/auth/profile', {
        name: profile.name,
        email: profile.email
      });
      // Update local auth state if name changed
      localStorage.setItem('token', data.token);
      window.location.reload(); // Simple way to refresh auth context
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Cập nhật thất bại' });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      return setMessage({ type: 'error', text: 'Mật khẩu xác nhận không khớp' });
    }
    
    setLoading(true);
    try {
      await api.put('/auth/profile', {
        password: passwords.newPassword
      });
      setMessage({ type: 'success', text: 'Đã đổi mật khẩu thành công' });
      setPasswords({ newPassword: '', confirmPassword: '' });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Đổi mật khẩu thất bại' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-12 pb-20">
      {/* Profile Header */}
      <section>
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-6">Thông tin tài khoản</h3>
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 bg-slate-900 text-white rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold">
              {profile.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 break-words">{profile.name}</h2>
              <p className="text-slate-500 font-medium text-sm sm:text-base break-all">{profile.email}</p>
              <p className="text-xs text-slate-400 mt-1 sm:mt-2">
                Thành viên từ: {profile.createdAt ? format(new Date(profile.createdAt), 'dd/MM/yyyy') : '...'}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Personal Details Form */}
        <section className="space-y-6">
          <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Chỉnh sửa thông tin</h4>
          <form onSubmit={handleUpdateProfile} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-5">
            <Input 
              label="Họ và tên"
              value={profile.name}
              onChange={(e) => setProfile({...profile, name: e.target.value})}
              required
            />
            <Input 
              label="Email"
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({...profile, email: e.target.value})}
              required
            />
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-medium transition-colors text-sm shadow-sm disabled:opacity-50"
            >
              Cập nhật thông tin
            </button>
          </form>
        </section>

        {/* Password Management */}
        <section className="space-y-6">
          <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Bảo mật & Mật khẩu</h4>
          <form onSubmit={handleChangePassword} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-5">
            <Input 
              label="Mật khẩu mới"
              type="password"
              placeholder="••••••••"
              value={passwords.newPassword}
              onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
              required
            />
            <Input 
              label="Xác nhận mật khẩu mới"
              type="password"
              placeholder="••••••••"
              value={passwords.confirmPassword}
              onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
              required
            />
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 py-3 rounded-xl font-medium transition-colors text-sm disabled:opacity-50"
            >
              Đổi mật khẩu
            </button>
          </form>
        </section>
      </div>

      {message.text && (
        <div className={`fixed bottom-10 right-10 p-4 rounded-2xl shadow-lg border ${
          message.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-red-50 border-red-100 text-red-800'
        } text-sm font-medium animate-in fade-in slide-in-from-bottom-4 duration-300`}>
          {message.text}
          <button onClick={() => setMessage({type:'', text:''})} className="ml-4 opacity-50 hover:opacity-100 font-bold">✕</button>
        </div>
      )}
    </div>
  );
};

export default Profile;
