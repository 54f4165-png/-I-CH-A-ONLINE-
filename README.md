# ĐI NHẬU ONLINE 3D MULTIPLAYER — V1.2

Đây là bản nâng cấp **có mã nguồn**, gồm website Vercel tĩnh và server WebSocket Node.js.

## Mới trong V1.2
- Chọn 6 màu trang phục trước khi vào phòng, đồng bộ cho người khác.
- Bong bóng chat trên đầu nhân vật, tự ẩn sau vài giây.
- Nút **GỌI MÓN** tạo món ăn ảo ngẫu nhiên, thông báo tới cả phòng.
- Bổ sung cây và đèn lồng 3D trang trí quán.
- Giữ các tính năng V1: tối đa 30 người/phòng, WASD/joystick, ngồi ghế, cụng ly, chat.

## Chạy local
Cần Node.js 20+. Trong `server-node`: `npm install` rồi `npm start`.
Trong `website-vercel`, chạy một static HTTP server (ví dụ `npx serve -l 3000 .`) và mở `http://localhost:3000`. Dùng server `ws://localhost:8080`.
Mở hai trình duyệt/tab với cùng mã phòng để thử multiplayer.

## Đưa lên Internet
- Upload **nội dung** `website-vercel` lên repository riêng, triển khai Vercel Framework **Other**, không cần build.
- Upload `server-node` lên repository khác và chạy `npm start` tại Render/Railway/VPS hỗ trợ WebSocket chạy liên tục.
- Nhập `wss://ten-server-cua-ban` vào màn hình đăng nhập game hoặc sửa `website-vercel/config.js`.
- Trang Vercel HTTPS cần WebSocket `wss://`; Vercel không thay thế server WebSocket chạy liên tục.

## Giới hạn
Chưa có NPC phục vụ, karaoke, tài khoản, voice chat hay avatar 3D chi tiết. Đây là nhân vật 3D hình học; hoạt ảnh đơn giản. Dữ liệu phòng nằm trong RAM và mất khi restart. Giới hạn 30 người/phòng là cấu hình, **chưa kiểm thử tải 30 người**. Server chưa có hệ thống moderation/anti-cheat đầy đủ, không nên công khai quy mô lớn trước khi gia cố. Three.js tải từ CDN nên cần Internet.
