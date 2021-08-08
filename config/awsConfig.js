const aws = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')

aws.config.update({
    secretAccessKey: process.env.AWS_SECRET,
    accessKeyId: process.env.AWS_ID,
    region: process.env.AWS_REGION
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

const s3 = new aws.S3()
module.exports.upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET,
    key: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname) 
    }
  }),
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
})
