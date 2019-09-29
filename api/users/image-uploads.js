const multer = require('multer');
const cryptoRandomString = require('crypto-random-string');

module.exports = {
  upload
};

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './profile-images/');
  },
  filename: function(req, file, cb) {
    if (file.mimetype === 'image/jpeg') {
      cb(null, cryptoRandomString({ length: 33, type: 'url-safe' }) + '.jpeg');
    } else if (file.mimetype === 'image/png') {
      cb(null, cryptoRandomString({ length: 33, type: 'url-safe' }) + '.png');
    } else {
      cb(false);
    }
  }
});

const fileFilter = function(req, file, cb) {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(false);
  }
};

function upload(req) {
  return multer({
    storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // 5mb
    fileFilter
  });
}
