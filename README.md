# Anrose Clinic Website — Updated Source

Bản source này đã được cập nhật để đưa toàn bộ nhóm ảnh người dùng gửi ngày 28/10/2026 vào website theo cấu trúc hợp lý, giữ Anrose Design DNA.

## Cấu trúc nội dung

Ảnh bìa đầu trang: `assets/images/cover-20-10.webp` (ảnh người dùng cung cấp).

1. Chương trình ưu đãi — 6 poster mới ngày 28/10/2026, tiếp theo là 2 poster trẻ hóa và laser; bỏ poster 20/10 cũ khỏi trang
2. Hero / giới thiệu thương hiệu
3. Dịch vụ chính
4. Công nghệ HIFU Doublo New
5. Thăm khám & tư vấn — 3 ảnh
6. Điều trị thực tế — 8 ảnh laser
7. Không gian Anrose — 4 ảnh ngoại thất/nội thất
8. Feedback khách hàng
9. Form tư vấn

## Ảnh mới

Toàn bộ 17 ảnh mới được tối ưu thành WebP trong:

`assets/images/gallery/`

Ảnh gốc không bị chỉnh sửa hoặc ghi đè. Bản WebP chỉ dùng để website tải nhanh hơn.

## Chạy website

Có thể mở `index.html` trực tiếp hoặc chạy local server:

```bash
python3 -m http.server 8000
```

Sau đó mở `http://localhost:8000`.

## Nhận đăng ký tư vấn qua Gmail

Khi khách điền form "Đặt lịch tư vấn" và bấm **Gửi đăng ký tư vấn**, thông tin (họ tên, số điện thoại, dịch vụ, thời gian, ghi chú) được gửi thẳng về Gmail của phòng khám qua dịch vụ miễn phí [FormSubmit](https://formsubmit.co). Không cần tạo tài khoản hay mã khóa.

Cài đặt một lần:

1. Mở `index.html`, tìm `data-formsubmit=""` và điền Gmail nhận đăng ký vào giữa hai dấu ngoặc kép:

   ```html
   <form class="contact-form" method="post" data-formsubmit="ten-gmail@gmail.com">
   ```

2. Đưa website lên, rồi tự gửi thử một đăng ký trên trang. Lần đầu form sẽ báo "Chưa gửi được", đây là bình thường.
3. Mở Gmail đó, tìm email từ FormSubmit (xem cả mục Spam/Quảng cáo) và bấm **Activate Form**.
4. Gửi thử lại một lần nữa: từ giờ mỗi đăng ký sẽ về Gmail với tiêu đề "Đăng ký tư vấn mới: [Tên] – [SĐT]".

Nên làm thêm: sau khi kích hoạt, FormSubmit gửi một mã ngẫu nhiên (dạng `a1b2c3d4...`). Thay địa chỉ Gmail trong `data-formsubmit` bằng mã đó để Gmail không lộ trong mã nguồn trang.

Nếu gửi lỗi (mất mạng, chưa kích hoạt…), form báo lỗi và mời khách gọi hotline 0869 833 868. Thông tin không được lưu trên website.

## Chỉnh bằng Claude / Cursor

Mở nguyên thư mục này bằng VS Code/Cursor/Claude Code. Đọc thêm `AI_EDITING_GUIDE.md` trước khi chỉnh để giữ đúng màu sắc, font và bố cục Anrose.

## Font

CSS đang dùng fallback Google Fonts cho môi trường chạy thử:
- Heading: Cormorant Garamond fallback cho Beautique Display
- Body: Barlow

Nếu có license/font Beautique Display chính thức, đặt font local vào `assets/fonts/` rồi khai báo `@font-face` trong `styles.css`.

_Cập nhật lần cuối: 28/10/2026_
