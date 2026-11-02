# Đi Nhậu Online 3D Multiplayer V1.2 — Website Vercel

Chỉ chứa website tĩnh, không có Python, Node server, hay dự án Đi Chùa.

## Đưa lên GitHub/Vercel
1. Tạo repository GitHub **MỚI** (không dùng chung repository Đi Chùa).
2. Giải nén và tải **5 file index.html, style.css, game.js, config.js, vercel.json** lên ngay thư mục gốc repository (có thể kèm README.md).
3. Vercel > Add New > Project > Import repository mới.
4. Framework Preset: Other. Root Directory: ./ (để trống hoặc chọn gốc). Build Command: không override. Output Directory: theo vercel.json là dấu chấm.
5. Deploy, mở trang chủ để kiểm tra giao diện.

## Nếu dùng lại repository cũ
Bạn phải xóa các file/dự án cũ không liên quan khỏi root, và đặt Root Directory về ./; tránh nhầm lẫn. Khuyên dùng repository mới.

## Multiplayer
Vercel chỉ host giao diện. Bạn phải chạy server Node.js WebSocket riêng (từ ZIP server trước đó) trên Render/Railway/VPS và nhập wss://... vào màn hình vào quán, hoặc điền URL vào config.js. Không có server sẽ không vào chơi multiplayer được.

## Lưu ý
Website sử dụng Three.js tải từ https://esm.sh/three@0.170.0, nên trình duyệt cần internet.
