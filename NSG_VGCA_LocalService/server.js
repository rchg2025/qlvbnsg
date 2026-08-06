const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

const app = express();
const port = 8989;

// Bật CORS để cho phép Frontend React gọi API
app.use(cors());

// Cấu hình Multer lưu file tạm thời
const tempDir = path.join(os.tmpdir(), "vgca_local_signs");
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, tempDir);
    },
    filename: function (req, file, cb) {
        // Thay thế ký tự đặc biệt, giữ lại định dạng
        const safeName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_');
        // Thêm timestamp để tránh trùng lặp
        const finalName = Date.now() + '_' + safeName;
        cb(null, finalName);
    }
});

const upload = multer({ storage: storage });

app.post('/sign', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ isSuccess: false, message: "Không tìm thấy file để ký." });
    }

    const filePath = req.file.path;
    const vgcaToolPath = `"C:\\Program Files (x86)\\VGCA\\VGCASignTool\\VGCASignTool.exe"`;
    const command = `${vgcaToolPath} "${filePath}"`;

    console.log(`Đang gọi phần mềm ký số: ${command}`);

    // Thực thi lệnh mở phần mềm ký số
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Lỗi khi mở phần mềm ký số: ${error.message}`);
            return res.status(500).json({ isSuccess: false, message: "Lỗi khi gọi phần mềm ký số", error: error.message });
        }

        console.log(`Tiến trình ký số đã hoàn thành cho file: ${filePath}`);

        // Kiểm tra xem phần mềm VGCA có tạo file mới với hậu tố "_signed" hay không
        // Giả sử VGCA tạo file format: tênfile_signed.pdf
        const parsedPath = path.parse(filePath);
        let signedFilePath = path.join(parsedPath.dir, `${parsedPath.name}_signed${parsedPath.ext}`);
        
        // Nếu không có file _signed, giả định là VGCA ghi đè lên file gốc
        if (!fs.existsSync(signedFilePath)) {
            signedFilePath = filePath;
        }

        // Kiểm tra file kết quả
        if (fs.existsSync(signedFilePath)) {
            // Đọc file và gửi về Frontend
            res.download(signedFilePath, req.file.originalname, (err) => {
                if (err) {
                    console.error("Lỗi khi trả file về:", err);
                }
                
                // Dọn dẹp file tạm sau khi gửi xong
                try {
                    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                    if (signedFilePath !== filePath && fs.existsSync(signedFilePath)) fs.unlinkSync(signedFilePath);
                } catch (cleanupErr) {
                    console.error("Lỗi khi dọn dẹp file tạm:", cleanupErr);
                }
            });
        } else {
            res.status(500).json({ isSuccess: false, message: "Không tìm thấy file kết quả sau khi ký." });
        }
    });
});

app.listen(port, () => {
    console.log(`NSG VGCA Local Service đang chạy tại http://localhost:${port}`);
    console.log(`Vui lòng giữ cửa sổ này mở trong quá trình sử dụng chức năng Ký số.`);
});
