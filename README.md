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

## Nhận đăng ký tư vấn qua email

Khi khách điền form "Đặt lịch tư vấn" và bấm Gửi, thông tin (họ tên, số điện thoại, dịch vụ, thời gian, ghi chú) được gửi thẳng về email của phòng khám qua dịch vụ miễn phí [Web3Forms](https://web3forms.com). Khách không cần mở Messenger.

Cài đặt một lần:

1. Vào https://web3forms.com, nhập email muốn nhận đăng ký (ví dụ email của lễ tân) và bấm **Create Access Key**.
2. Mở hộp thư email đó, copy mã **Access Key** được gửi đến (dạng `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`).
3. Mở `index.html`, tìm `data-access-key=""` và dán mã vào giữa hai dấu ngoặc kép:

   ```html
   <form class="contact-form" method="post" data-access-key="MÃ-CỦA-BẠN">
   ```

4. Đưa website lên lại, rồi thử gửi một đăng ký để kiểm tra email đã về.

Lưu ý:
- Gói miễn phí của Web3Forms nhận khoảng 250 đăng ký mỗi tháng. Email đầu tiên có thể rơi vào mục Spam/Quảng cáo, hãy đánh dấu "Không phải spam".
- Mã Access Key nằm công khai trong mã nguồn trang. Đây là cách Web3Forms được thiết kế: mã chỉ dùng để gửi email về địa chỉ đã đăng ký, không đọc được dữ liệu.
- Nếu để trống `data-access-key`, form tự quay về cách cũ: tạo tin nhắn và mở Messenger cho khách tự gửi.
- Nếu gửi lỗi (mất mạng…), form báo lỗi và tạo sẵn tin nhắn để khách gửi qua Messenger hoặc gọi hotline.

## Chỉnh bằng Claude / Cursor

Mở nguyên thư mục này bằng VS Code/Cursor/Claude Code. Đọc thêm `AI_EDITING_GUIDE.md` trước khi chỉnh để giữ đúng màu sắc, font và bố cục Anrose.

## Font

CSS đang dùng fallback Google Fonts cho môi trường chạy thử:
- Heading: Cormorant Garamond fallback cho Beautique Display
- Body: Barlow

Nếu có license/font Beautique Display chính thức, đặt font local vào `assets/fonts/` rồi khai báo `@font-face` trong `styles.css`.

_Cập nhật lần cuối: 28/10/2026_
