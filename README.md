# Phật Pháp LIVE — Bản thử nghiệm

## Chạy nhanh
- Mở `index.html` để điều khiển; bấm **Mở cảnh LIVE** để mở `overlay.html` (cùng trình duyệt, cùng nguồn).
- Để sử dụng với OBS/TikTok LIVE Studio, nên chạy máy chủ cục bộ: cài Node.js 18+, mở Terminal trong thư mục, chạy `node server.js`, truy cập `http://localhost:3000` và dùng `http://localhost:3000/overlay.html` làm Browser Source 1080x1920.
- TTS: bật âm thanh trình duyệt và thiết lập thu âm thanh Browser Source trong phần mềm LIVE. Trình duyệt có thể yêu cầu tương tác trước khi cho phép phát âm thanh.

## Nhận sự kiện thật
Dự án KHÔNG tự lấy bình luận hay quà tặng từ TikTok. Cần bộ kết nối có quyền truy cập hợp lệ vào sự kiện LIVE. Khởi động máy chủ với biến môi trường `EVENT_TOKEN` là chuỗi bí mật mạnh. Bộ chuyển tiếp đã được xác thực gửi POST `http://localhost:3000/event` với header `Authorization: Bearer <EVENT_TOKEN>` và JSON:

`{"type":"comment","name":"Minh Tâm","text":"Nam mô A Di Đà Phật"}`
`{"type":"gift","name":"Diệu An","count":10}`
`{"type":"join","name":"Phúc Lộc"}`

Máy chủ phát các sự kiện qua SSE `/events`. Chỉ mở endpoint `/event` cho nguồn đáng tin; nếu triển khai công khai, bắt buộc HTTPS, bảo vệ token, giới hạn tốc độ và phân quyền. Không đưa token vào HTML/JS. Có thể cần cấu hình CORS, reverse proxy và kết nối nhà cung cấp sự kiện thực tế.

## Giới hạn hiện tại
- Nhân vật minh họa bằng CSS, có hoạt ảnh cúi lạy và gắn tên, chưa phải nhân vật Unity 3D đi lại tự do.
- TTS dùng giọng đọc trình duyệt, không phải dịch vụ AI giọng nói chất lượng cao.
- Bảng xếp hạng là số lượng sự kiện quà tặng được nhận, không phải doanh thu. Chỉ nên ghi nhận quà tặng thực đã xác thực.
- Dữ liệu lưu trong localStorage của trình duyệt và đồng bộ giữa các tab cùng origin. OBS Browser Source có thể dùng kho lưu trữ khác, vì vậy bản thử nghiệm ổn định nhất khi dùng máy chủ SSE. Bản triển khai thực cần cơ sở dữ liệu và xử lý nhiều phiên.
- Chưa có kết nối TikTok LIVE chính thức; chưa kiểm chứng điều kiện sử dụng API hoặc chính sách nền tảng cho tài khoản cụ thể.

## Kết nối TikTok LIVE trên Windows (bản mở rộng)
1. Cài **Node.js 18+** và **Python 3.10+** (chọn Add Python to PATH).
2. Nhấp đúp `START_LIVE.bat`. Lần đầu chương trình cài thư viện TikTokLive (cần Internet).
3. Nhập username TikTok đang LIVE (không cần @). Chương trình mở `http://127.0.0.1:3000`.
4. Trong TikTok LIVE Studio, thêm nguồn **Link/Website** nếu phiên bản hỗ trợ, nhập `http://127.0.0.1:3000/overlay.html`, chọn 1080x1920. Nếu không có nguồn Link, dùng **Window Capture** cửa sổ trình duyệt đang mở `overlay.html`.
5. Kiểm tra giọng nói có được LIVE Studio thu vào hay không; trình duyệt có thể chặn tự phát âm thanh. Click một lần vào cửa sổ overlay để mở khóa đọc; nếu cần, dùng nguồn thu âm thanh máy tính trong LIVE Studio.
6. Bảng xếp hạng **chỉ cộng quà có tên `Hoa Sen` hoặc `Lotus`**. Nếu TikTok dùng tên quà khác, sửa danh sách trong `tiktok_bridge.py` sau khi quan sát tên quà in trên terminal.
7. Không công khai cổng 3000 ra Internet. Token mặc định trong .bat chỉ dành cho chạy cục bộ; thay bằng token bí mật mạnh khi triển khai mạng.

**Lưu ý:** TikTokLive là thư viện không chính thức, có thể bị thay đổi hoặc chặn. Phiên LIVE phải đang hoạt động; quyền truy cập, chính sách và khả năng nhận sự kiện thay đổi theo tài khoản/khu vực. Giọng đọc dùng Windows/browser TTS, không phải AI cloud. Chưa có tự động điều khiển nhân vật 3D theo quà tặng.
