# Mnema — Demo UI

Demo trực quan cho hệ thống ghi chú thích ứng dựa trên phân rã tri thức nguyên tử. Toàn bộ dữ liệu là mock — không có logic backend thực.

## Chạy

```bash
cd mnema
npm install
npm run dev
```

Mở `http://localhost:5173`.

## Các màn hình

| Đường dẫn | Mục đích |
| --- | --- |
| `/` | Dashboard — feed "Đang nổi lên cho bạn" với filter Sắp quên / Liên quan / Mâu thuẫn / Mới |
| `/notes` | Danh sách ghi chú theo project |
| `/note/n2` | Note editor — minh hoạ Atomic Engine phân rã text thành hạt, hover để liên kết text ↔ hạt |
| `/graph` | Bản đồ tri thức — graph SVG, toggle màu theo cụm hoặc retention |
| `/review` | Phiên ôn active recall với 4 mức độ phản hồi (Quên/Khó/Vừa/Dễ) |
| `/insights` | Hồ sơ nhận thức — forgetting curve cá nhân, heatmap chủ đề, tín hiệu Mnema theo dõi |

## Stack

- React 18 + Vite
- Tailwind CSS 3 (dark mode)
- React Router 6
- Lucide icons
- Inter (sans) + Cormorant Garamond (serif) cho cảm giác academic
