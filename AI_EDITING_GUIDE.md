# AI Editing Guide — Anrose Clinic

## Bắt buộc giữ
- Premium Beauty / Medical Aesthetic / Korean Beauty Editorial.
- Nền trắng sữa, ivory, kem sáng; tránh vàng cam nặng.
- Accent chính: #A76B03, #9B621C, champagne #C8A16A.
- Typography: Cormorant Garamond cho heading, Barlow cho body (đều qua Google Fonts). Không thêm Beautique Display vào font stack nếu chưa self-host bằng giấy phép webfont, vì máy có cài font sẽ hiển thị khác điện thoại.
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

## Giao diện 2026-10 (redesign)
- Logo header/footer: `assets/icons/anrose-logo-wordmark.png` (nền trong suốt, cắt từ `anrose-logo-original.png`).
- Hiệu ứng: thêm class `reveal` (+ `delay-1/2/3`) để phần tử hiện dần khi cuộn; easing chung `--ease` trong `styles.css`.
- Lightbox tự gom ảnh `.js-lightbox` trong cùng section thành gallery (mũi tên, phím ←/→, vuốt).
- Ưu đãi: thêm poster mới bằng một `.poster-card` với `data-offer-title/price/description`; dots, đếm số và nút "Đặt lịch ưu đãi này" tự cập nhật.
- Link có `data-service="..."` sẽ tự chọn dịch vụ trong form tư vấn.
- Luôn tôn trọng `prefers-reduced-motion` khi thêm animation mới.

## Prompt đề xuất cho AI khác
"Hãy chỉnh website này nhưng giữ nguyên Anrose Design DNA, palette ivory/cream + #A76B03/#9B621C, bố cục premium tối giản. Không tự ý xóa các section hoặc các ảnh trong assets/images/gallery. Khi thêm nội dung mới, ưu tiên khoảng thở, typography thanh lịch, responsive tốt và tốc độ tải nhanh."
