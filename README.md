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

## Chỉnh bằng Claude / Cursor

Mở nguyên thư mục này bằng VS Code/Cursor/Claude Code. Đọc thêm `AI_EDITING_GUIDE.md` trước khi chỉnh để giữ đúng màu sắc, font và bố cục Anrose.

## Font

CSS đang dùng fallback Google Fonts cho môi trường chạy thử:
- Heading: Cormorant Garamond fallback cho Beautique Display
- Body: Barlow

Nếu có license/font Beautique Display chính thức, đặt font local vào `assets/fonts/` rồi khai báo `@font-face` trong `styles.css`.
