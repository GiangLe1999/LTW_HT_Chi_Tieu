import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import Input from '../components/Input';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError('Mật khẩu xác nhận không khớp.');
    }
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] font-sans">
      <div className="max-w-md w-full px-6 py-12 bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 my-10">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
            Fina<span className="text-blue-600">.</span>
          </h2>
          <p className="text-slate-500 font-medium">Bắt đầu quản lý tài chính ngay hôm nay</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-medium border border-red-100/50">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Họ và tên"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="vd: Nguyễn Văn A"
            required
          />
          <Input
            label="Địa chỉ Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            required
          />
          <Input
            label="Mật khẩu"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          <Input
            label="Xác nhận mật khẩu"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          
          <button
            type="submit"
            className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-2xl font-bold transition-all transform hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-slate-200 mt-4"
          >
            Tạo tài khoản miễn phí
          </button>
        </form>

        <p className="mt-10 text-center text-slate-500 text-sm font-medium">
          Đã có tài khoản?{' '}
          <Link to="/login" className="text-blue-600 hover:text-blue-700 font-bold underline underline-offset-4 decoration-2">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
