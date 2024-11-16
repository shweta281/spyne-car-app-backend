const multer = require('multer');
// import public from "./"

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
    cb(null, './public');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

module.exports = upload;
