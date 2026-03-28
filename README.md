# Hệ Thống Quản Lý Chi Tiêu Cá Nhân (Personal Expense Management System)

Đây là một ứng dụng web fullstack (MERN) giúp người dùng quản lý chi tiêu cá nhân, theo dõi ngân sách, phân tích chi tiêu và trực quan hóa dữ liệu.

## Công nghệ sử dụng

- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT, bcryptjs
- **Frontend**: ReactJS (Vite), TailwindCSS, React Router, Axios, Chart.js, react-chartjs-2
- **Khác**: dotenv, cors, lucide-react, date-fns

## Cấu trúc thư mục

- `/backend`: Mã nguồn server Node.js
- `/frontend`: Mã nguồn client ReactJS

## Yêu cầu hệ thống

- Node.js (v16 trở lên)
- MongoDB (Local hoặc Atlas)

## Hướng dẫn cài đặt & Chạy dự án

### 1. Cài đặt Backend

1. Di chuyển vào thư mục backend: `cd backend`
2. Cài đặt dependencies: `npm install`
3. Cấu hình file `.env` (xem chi tiết ở dưới)
4. Chạy server: `npm run dev` (Server sẽ chạy tại `http://localhost:5000`)

### 2. Cài đặt Frontend

1. Di chuyển vào thư mục frontend: `cd frontend`
2. Cài đặt dependencies: `npm install`
3. Chạy client: `npm run dev` (Client sẽ chạy tại `http://localhost:5173`)

### 3. Cấu hình file `.env` (Backend)

Tạo file `.env` trong thư mục `backend` với nội dung sau:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/expense_management
JWT_SECRET=your_jwt_secret_key_here
```

Test

## Tính năng chính

- Đăng ký / Đăng nhập (JWT Authentication)
- CRUD Chi tiêu (Thêm, sửa, xóa, xem danh sách)
- Lọc chi tiêu theo ngày, danh mục; Tìm kiếm theo tiêu đề
- Dashboard với các biểu đồ tổng quan (Pie chart, Line chart)
- Quản lý ngân sách hàng tháng (Cảnh báo vượt ngân sách)
- Phân tích chi tiêu chi tiết

## Gợi ý cải tiến trong tương lai

- Hỗ trợ Dark Mode.
- Tính năng Export/Import dữ liệu (CSV/Excel).
- Hỗ trợ đa tiền tệ (Multi-currency).
- Tích hợp AI để dự đoán và phân tích thói quen chi tiêu.
