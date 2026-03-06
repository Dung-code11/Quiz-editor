Quiz Editor Demo - Ứng dụng tạo và làm bài kiểm tra trực tuyến

P/s : Sản phẩm demo giao diện,luồng hoạt dộng sự kiện của dự án

Giới thiệu

    Quiz Editor là một ứng dụng web cho phép người dùng tạo và làm bài kiểm tra trực tuyến. Ứng dụng hỗ trợ hai vai trò: Admin (tạo quiz) và User (làm bài kiểm tra).

Cài đặt

    Yêu cầu
    Node.js 16+
    npm hoặc yarn

Tính năng chính

    Admin
    Tạo quiz mới với tiêu đề và mô tả
    Quản lý câu hỏi: Thêm, sửa, xóa, sắp xếp câu hỏi
    Hỗ trợ hai loại câu hỏi:
    Một đáp án (radio button)
    Nhiều đáp án (checkbox) - cho phép chọn nhiều đáp án đúng
    Quản lý đáp án: Thêm, sửa, xóa các lựa chọn
    Import/Export JSON: Nhập/xuất dữ liệu quiz
    Lưu quiz vào bộ nhớ trình duyệt
    Danh sách quiz đã tạo: Xem, sửa, xóa quiz

    User
    Xem danh sách quiz có sẵn
    Làm bài kiểm tra với giao diện thân thiện
    Đánh dấu câu hỏi để xem lại sau
    Tự động chuyển câu sau khi trả lời
    Xem kết quả chi tiết:
    Điểm số tổng quan
    Thống kê số câu đúng/sai
    Xem lại từng câu trả lời
    So sánh với đáp án đúng
    Hỗ trợ tính điểm cho câu nhiều đáp án

    Công nghệ sử dụng
    React 18 - Thư viện UI
    React Router DOM 6 - Quản lý routing
    CSS Modules - Styling components
    React Icons - Icon components
    LocalStorage/SessionStorage - Lưu trữ dữ liệu

Các bước cài đặt

    1.Clone repository

        git clone https://github.com/Dung-code11/Quiz-editor.git
        cd quiz-editor

    2.Cài đặt dependencies
 
        npm install
        # hoặc
        yarn install

    3.Cài đặt các thư viện cần thiết

        npm install react-router-dom react-icons

    4.Chạy ứng dụng

        npm run dev
        # hoặc
        yarn dev

    5.Truy cập ứng dụng

        http://localhost:5173

Hướng dẫn sử dụng

    Đăng nhập

    Sử dụng một trong hai tài khoản demo:

    Vai trò |	Email	       |    Mật khẩu
    Admin   |	admin@quiz.com |    admin123
    User	|   user@quiz.com  |	user123

Admin - Tạo quiz

    Đăng nhập với tài khoản Admin

    Tạo quiz mới:
    Nhập tên quiz
    Thêm mô tả (không bắt buộc)

    Thêm câu hỏi:
    Nhập tiêu đề câu hỏi
    Thêm mô tả (không bắt buộc)
    Thêm các lựa chọn
    Đánh dấu đáp án đúng

    Lưu quiz:
    Chỉ lưu: Lưu vào localStorage
    Chỉ Export: Xuất file JSON
    Lưu và Export: Cả hai

User - Làm bài kiểm tra

    Đăng nhập với tài khoản User

    Chọn quiz từ danh sách

    Làm bài:
    Trả lời từng câu hỏi
    Đánh dấu câu để xem lại (flag)
    Xem tiến độ qua thanh progress
    Điều hướng bằng bảng điều khiển

    Nộp bài:
    Xác nhận trước khi nộp
    Xem kết quả chi tiết
    Làm lại quiz nếu muốn

Tính năng nổi bật

  Quiz Editor (Admin)

    Floating Action Button để thêm câu hỏi nhanh

    Tự động cuộn đến câu hỏi mới

    Sắp xếp câu hỏi bằng nút lên/xuống

    Nhân bản câu hỏi

    Import/Export JSON

    Validation dữ liệu

  Quiz Taking (User)

    Timer đếm ngược

    Tự động chuyển câu sau khi trả lời

    Đánh dấu câu hỏi để xem lại

    Bảng điều hướng câu hỏi

    Hiển thị tiến độ

    Xác nhận trước khi nộp bài
    
  Quiz Results (User)

    Hiển thị điểm số với màu sắc

    Thống kê chi tiết

    Xem lại từng câu trả lời

    So sánh với đáp án đúng

    Hỗ trợ câu nhiều đáp án

    Tính điểm một phần

  Bảo mật

    Authentication: Lưu thông tin user trong localStorage

    Protected Routes: Kiểm tra quyền truy cập

    Role-based access: Phân quyền Admin/User