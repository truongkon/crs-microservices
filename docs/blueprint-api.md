# Blueprint API

Liệt kê toàn bộ endpoint dự kiến cho cả hệ thống.

---

## 1. auth-service
> **Cổng:** `8081`  
> **Tiền tố khi qua Gateway:** `/api/auth`

| Method | Endpoint | Mô tả | Yêu cầu |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/login` | Đăng nhập, trả về JWT | Public |
| `POST` | `/auth/register` | (tuỳ chọn) Đăng ký tài khoản | Public |

---

## 2. course-service
> **Cổng:** `8082`  
> **Tiền tố:** `/api/courses`

### API Công khai / Quản lý (Qua Gateway)

| Method | Endpoint | Mô tả | Yêu cầu |
| :--- | :--- | :--- | :--- |
| `GET` | `/courses` | Danh sách, có search + phân trang | Public |
| `GET` | `/courses/{id}` | Chi tiết 1 môn học | Public |
| `POST` | `/courses` | Thêm môn học | ADMIN |
| `PUT` | `/courses/{id}` | Sửa môn học | ADMIN |
| `DELETE` | `/courses/{id}` | Xoá môn học | ADMIN |

### API Nội bộ
> *(Chỉ gọi từ `registration-service`, **KHÔNG** lộ ra Gateway cho Frontend)*

| Method | Endpoint | Mô tả |
| :--- | :--- | :--- |
| `PATCH` | `/internal/courses/{id}/reserve-seat` | Kiểm tra còn chỗ, trừ `soChoConLai` (transactional) |
| `PATCH` | `/internal/courses/{id}/release-seat` | Hoàn trả 1 chỗ khi huỷ đăng ký |

---

## 3. registration-service
> **Cổng:** `8083`  
> **Tiền tố:** `/api/registrations`

| Method | Endpoint | Mô tả | Yêu cầu |
| :--- | :--- | :--- | :--- |
| `POST` | `/registrations` | Đăng ký học phần (gọi ngầm sang course-service) | STUDENT |
| `GET` | `/registrations/my` | Danh sách đăng ký của tôi | STUDENT |
| `DELETE` | `/registrations/{id}` | Huỷ đăng ký (gọi ngầm release-seat) | STUDENT/ADMIN |