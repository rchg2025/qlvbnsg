# Luôn Đồng Bộ Lên GitHub

Sau khi hoàn tất việc chỉnh sửa code, luôn phải tự động commit và push những thay đổi đó lên GitHub. Bạn phải thực hiện đẩy code lên cả 3 nơi sau đây:

Repository của dự án:
- **Dự án gốc (Root):** [https://github.com/rchg2025/qlvbnsg](https://github.com/rchg2025/qlvbnsg) (nằm ở thư mục gốc của workspace `qlvb`)
- **Backend (BE):** [https://github.com/rongcon-hg/NSG_DocumentMange_BE](https://github.com/rongcon-hg/NSG_DocumentMange_BE) (nằm ở thư mục `NSG_DocumentMange_BE`)
- **Frontend (FE):** [https://github.com/rongcon-hg/NSG_DocumentMange_FE](https://github.com/rongcon-hg/NSG_DocumentMange_FE) (nằm ở thư mục `NSG_DocumentMange_FE`)

Các bước thực hiện khi push:
1. Tại thư mục gốc của dự án (`qlvb`): `git add .`, `git commit -m "..."`, `git push origin main`
2. Tại thư mục `NSG_DocumentMange_FE`: `git add .`, `git commit -m "..."`, `git push origin main`
3. Tại thư mục `NSG_DocumentMange_BE`: `git add .`, `git commit -m "..."`, `git push origin main`

Đảm bảo thực hiện thao tác này mà không cần chờ người dùng nhắc nhở. Lệnh trong PowerShell cần sử dụng `;` thay vì `&&` để chạy nối tiếp lệnh.
