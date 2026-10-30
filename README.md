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

Khi khách điền form "Đặt lịch tư vấn" và bấm **Gửi đăng ký tư vấn**, thông tin được gửi tới một Google Apps Script chạy trong tài khoản Google của phòng khám. Script gửi email từ Gmail đó về địa chỉ `NOTIFY_EMAIL`, tiêu đề "Đăng ký tư vấn mới: [Tên] – [SĐT]". Không qua dịch vụ bên thứ ba.

Code của script nằm trong `apps-script/Code.gs`.

Cài đặt một lần (khoảng 5 phút):

1. Đăng nhập Google, mở https://script.google.com và bấm **Dự án mới** (New project).
2. Xoá hết code mẫu, dán toàn bộ nội dung `apps-script/Code.gs`. Đổi tên dự án thành "Anrose booking" rồi bấm biểu tượng **Lưu**.
3. Ở thanh trên, chọn hàm **testSend** rồi bấm **Chạy** (Run). Google hỏi quyền: bấm **Xem lại quyền** → chọn tài khoản → **Nâng cao** → **Đi tới Anrose booking (không an toàn)** → **Cho phép**. Cảnh báo "không an toàn" là bình thường với script tự viết. Gmail sẽ nhận một email mẫu.
4. Bấm **Triển khai** (Deploy) → **Tùy chọn triển khai mới** (New deployment) → biểu tượng bánh răng → **Ứng dụng web** (Web app).
   - Thực thi dưới dạng (Execute as): **Tôi** (Me)
   - Người có quyền truy cập (Who has access): **Bất kỳ ai** (Anyone)
   
   Bấm **Triển khai** và copy **URL ứng dụng web** (dạng `https://script.google.com/macros/s/.../exec`).
5. Mở `index.html`, tìm `data-endpoint=""` và dán URL vào giữa hai dấu ngoặc kép.
6. Đưa website lên, gửi thử một đăng ký và kiểm tra Gmail.

Lưu ý:
- Đổi Gmail nhận thông báo: sửa `NOTIFY_EMAIL` trong script, rồi **Triển khai** → **Quản lý triển khai** → bút chì → Phiên bản: **Phiên bản mới** → **Triển khai**. URL giữ nguyên.
- Gmail cá nhân gửi được khoảng 100 email mỗi ngày qua Apps Script.
- Mở URL ứng dụng web trên trình duyệt sẽ thấy `"Anrose booking đang hoạt động"`: dùng để kiểm tra script còn chạy.
- Nếu gửi lỗi, form báo lỗi và mời khách gọi hotline 0869 833 868. Thông tin không được lưu trên website.

## Chỉnh bằng Claude / Cursor

Mở nguyên thư mục này bằng VS Code/Cursor/Claude Code. Đọc thêm `AI_EDITING_GUIDE.md` trước khi chỉnh để giữ đúng màu sắc, font và bố cục Anrose.

## Font

Website dùng font miễn phí của Google Fonts, giống nhau trên máy tính và điện thoại:
- Tiêu đề: Cormorant Garamond
- Nội dung: Barlow

Không dùng Beautique Display cài trên máy: font đó chỉ hiện trên máy đã cài, điện thoại khách sẽ thấy font khác. Chỉ đưa Beautique lên web khi có giấy phép webfont, bằng `@font-face` với file trong `assets/fonts/`.

_Cập nhật lần cuối: 30/10/2026_
