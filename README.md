# Virtual Sylvia

Website tương tác dành cho Sylvia — The Verdant Primordial.

## Chạy trên máy
1. Cài Node.js (bản LTS).
2. Giải nén project.
3. Mở terminal tại thư mục project và chạy:
   ```bash
   npm install
   npm run dev
   ```
4. Mở địa chỉ local mà Vite hiển thị.

## Thêm ảnh Sylvia
Đặt ảnh nhân vật tên chính xác là `1.jpg` vào thư mục `public/` (thay file placeholder 0 byte hiện tại). Không cần sửa code.

## Đưa lên GitHub và Vercel
- Upload toàn bộ thư mục project lên một GitHub repository.
- Trên Vercel chọn **Add New → Project**, import repository.
- Framework: Vite (thường được tự nhận diện).
- Build command: `npm run build`
- Output directory: `dist`
- Chọn Deploy.

## Tính năng hiện có
- Trang thánh điện và hồ sơ Sylvia.
- Dâng hoa, sừng động vật, đồ handmade, cây cỏ: lời khen riêng.
- Dâng người sống: lời quở trách, hiệu ứng sấm sét.
- Cầu nguyện và rút ba lá Tarot ngẫu nhiên (quá khứ / hiện tại / tương lai).
- Khung chat tương tác bằng lời thoại mẫu.
- Lưu số lần dâng lễ và ân sủng trong trình duyệt (localStorage).

## Ghi chú
Chat và phần luận giải Tarot hiện là tương tác frontend, chưa kết nối AI hoặc backend. Dữ liệu số lần dâng lễ được lưu trên thiết bị/trình duyệt hiện tại.
