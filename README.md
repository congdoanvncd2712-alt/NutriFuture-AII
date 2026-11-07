# NutriFuture

Ứng dụng học tập và thực hành dinh dưỡng dành cho học sinh THPT (THCS và THPT Ngã Sáu, độ tuổi 15–22).
Web tĩnh thuần HTML/CSS/JS, chạy hoàn toàn trên GitHub Pages, không cần máy chủ.

## Cấu trúc

| File | Vai trò |
| --- | --- |
| `index.html` | Khung trang và 6 tính năng |
| `Style.css` | Màu sắc, bố cục, hiệu ứng, giao diện 9 cấp |
| `foods.js` | Cơ sở dữ liệu 252 món ăn (biến `D`) |
| `app.js` | Toàn bộ logic: hồ sơ, tra cứu, camera AI, thực đơn, nhật ký, gamification |

Thứ tự nạp script trong `index.html` phải giữ nguyên: `foods.js` trước, `app.js` sau.

## Đưa lên GitHub Pages

1. Tạo repository, tải cả 5 file lên **thư mục gốc**.
2. Vào **Settings → Pages**, chọn nhánh `main`, thư mục `/ (root)`, bấm **Save**.
3. Mở địa chỉ `https://<tên-tài-khoản>.github.io/<tên-repo>/`.

Tên file `Style.css` phân biệt hoa thường trên GitHub Pages, hãy giữ đúng chữ **S** hoa.

## Lấy API key Gemini miễn phí

1. Vào https://aistudio.google.com/apikey và đăng nhập Google.
2. Bấm **Create API key**, sao chép khóa.
3. Mở web, bấm nút ⚙ trên thanh trên cùng, dán khóa, bấm **Lưu khóa**.

- Model dùng: `gemini-2.5-flash-lite` (nhanh, ít tốn quota). Muốn đổi, sửa tên model trong hàm `ai()` ở `app.js`.
- Khóa chỉ lưu trong `localStorage` của trình duyệt mỗi người dùng. **Không ghi khóa vào code** và không đưa lên repo.
- Ảnh được thu nhỏ còn tối đa 768 px trước khi gửi để tiết kiệm quota.
- Gặp lỗi quota (429): đợi vài phút rồi thử lại.

AI được dùng cho: tra món không có trong dữ liệu, nhận diện món qua ảnh, và tạo 5 câu đố mỗi ngày (có 5 câu dự phòng khi AI không phản hồi).

## Chỉnh sửa dữ liệu món ăn

Mỗi dòng trong `foods.js` có dạng:

```js
["Phở bò tái","1 tô (450g)",430,26,12,54,""]
// tên, khẩu phần, kcal, đạm, béo, carb, tỉnh/thành đặc sản ("" nếu món phổ biến)
```

Thêm món mới bằng cách thêm một dòng cùng định dạng. Cột đặc sản ghi theo đơn vị hành chính mới, nên rà soát lại.

## Cảnh báo dị ứng

Với món trong dữ liệu, ứng dụng so khớp theo **tên món** (bảng `AS` trong `app.js` ghép từ khóa như "sữa" với phô mai, latte, pizza...). Với món do AI nhận diện, có thêm nguyên liệu mà AI trả về. Đây chỉ là công cụ hỗ trợ, không thay thế việc đọc nhãn thực phẩm và hỏi bác sĩ.

## Điểm và giao diện

| Cấp | Giao diện | Điểm mở khóa |
| --- | --- | --- |
| 1 | Khởi đầu xanh | 0 |
| 2 | Rạng đông | 100 |
| 3 | Thiên lam | 250 |
| 4 | Cực quang | 450 |
| 5 | Hành tinh | 700 |
| 6 | Hoàng kim | 1000 |
| 7 | Thần quang | 1400 |
| 8 | Vĩnh Hằng | 1900 |
| 9 | Ngân hà | 2500 |

Ngưỡng điểm nằm ở mảng `LV` trong `app.js`. Điểm thưởng: tạo hồ sơ +20, tra cứu +2, ghi nhật ký +10, câu đố đúng +20/câu, chuỗi ngày +10, thử thách tuần +50.

## Dữ liệu người dùng

Hồ sơ, nhật ký, điểm lưu trong `localStorage`. Dùng nút **Sao lưu JSON** và **Khôi phục** ở tab Nhật ký để chuyển sang thiết bị khác. File sao lưu không chứa API key.

## Lưu ý đã xử lý trong dữ liệu gốc

- "Bánh tráng cuốn sốt bơ": carb 448 g được sửa thành 44 g.
- Cột STT bị lặp 0–9 nên không được dùng.
