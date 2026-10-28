# AI Editing Guide — Anrose Clinic

## Bắt buộc giữ
- Premium Beauty / Medical Aesthetic / Korean Beauty Editorial.
- Nền trắng sữa, ivory, kem sáng; tránh vàng cam nặng.
- Accent chính: #A76B03, #9B621C, champagne #C8A16A.
- Typography: Beautique Display cho heading nếu có font hợp lệ; Barlow cho body.
- Bố cục thoáng, ít họa tiết, nhiều negative space.
- Animation nhẹ, không lạm dụng parallax/glow.
- Không làm ảnh điều trị quá bóng hoặc ám vàng.

## Cấu trúc ảnh hiện tại
- `assets/images/gallery/promo-*.webp`: visual thiết kế/ưu đãi.
- `assets/images/gallery/consultation-*.webp`: thăm khám/tư vấn.
- `assets/images/gallery/treatment-*.webp`: ảnh điều trị thực tế.
- `assets/images/gallery/space-*.webp` + `clinic-exterior.webp`: không gian.

## Khi sửa
- Không gom tất cả ảnh thành một gallery dài.
- Giữ nhóm ảnh theo section như hiện tại.
- Không xóa ảnh người dùng đã yêu cầu đưa lên web nếu chưa được yêu cầu.
- Mobile: gallery điều trị chuyển thành horizontal swipe để tránh trang quá dài/rối.
- Ảnh gallery có lightbox; giữ class `.js-lightbox` và data attributes nếu thay ảnh.

## Prompt đề xuất cho AI khác
"Hãy chỉnh website này nhưng giữ nguyên Anrose Design DNA, palette ivory/cream + #A76B03/#9B621C, bố cục premium tối giản. Không tự ý xóa các section hoặc các ảnh trong assets/images/gallery. Khi thêm nội dung mới, ưu tiên khoảng thở, typography thanh lịch, responsive tốt và tốc độ tải nhanh."
