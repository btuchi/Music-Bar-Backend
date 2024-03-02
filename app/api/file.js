// File upload request

const Router = require("koa-router");
const fs = require("fs");
const multer = require('@koa/multer');
const path = require('path');
const router = new Router({
    prefix: "/file",
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../../public'); // 创建子目录路径
        fs.mkdirSync(uploadPath, { recursive: true }); // 创建子目录
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname); // 获取原始文件的扩展名
      const fileName = `${Date.now()}${ext}`; // 使用当前时间戳作为文件名
      cb(null, fileName);
    },
  });
  
const upload = multer({ storage });

router.post('/upload', upload.single('file'), async (ctx) => {
  const file = ctx.file; // 获取上传的文件
  ctx.body = {
    code:0,
    msg:"上传成功",
    data:{
      url: `${file.filename}`
    }
  }
});



module.exports = router