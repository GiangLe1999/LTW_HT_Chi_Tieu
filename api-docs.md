# API Documentation

## Base URL
`http://localhost:5000/api`

## Authentication (`/api/auth`)
| Method | Endpoint | Description | Request Body | Response |
|---|---|---|---|---|
| POST | `/register` | Đăng ký tài khoản mới | `{ name, email, password }` | `{ token, user }` |
| POST | `/login` | Đăng nhập hệ thống | `{ email, password }` | `{ token, user }` |
| GET | `/profile` | Lấy thông tin user hiện tại (Yêu cầu JWT Token) | None | `{ user }` |

## Expenses (`/api/expenses`) - Requires JWT Token
| Method | Endpoint | Description | Request Body | Response |
|---|---|---|---|---|
| GET | `/` | Lấy danh sách chi tiêu | Lọc qua query params `?category=&startDate=&endDate=&search=` | `[{ _id, title, amount, category, date, notes }]` |
| POST | `/` | Thêm chi tiêu mới | `{ title, amount, category, date, notes }` | `{ expense }` |
| PUT | `/:id` | Cập nhật chi tiêu | `{ title, amount, category, date, notes }` | `{ expense }` |
| DELETE | `/:id` | Xóa chi tiêu | None | `{ message: "Deleted successfully" }` |

## Analytics (`/api/analytics`) - Requires JWT Token
| Method | Endpoint | Description | Request Body | Response |
|---|---|---|---|---|
| GET | `/category` | Lấy dữ liệu tổng hợp theo danh mục | Lọc qua query params `?month=&year=` | `[{ _id: "Category Name", total: Number }]` |
| GET | `/monthly` | Lấy dữ liệu tổng hợp theo từng tháng | `?year=` | `[{ _id: "Month", total: Number }]` |

## Budget (`/api/budget`) - Requires JWT Token
| Method | Endpoint | Description | Request Body | Response |
|---|---|---|---|---|
| GET | `/` | Lấy ngân sách hiện tại | Lọc qua query params `?month=&year=` | `{ budget }` |
| POST | `/` | Thiết lập hoặc cập nhật ngân sách | `{ amount, month, year }` | `{ budget }` |