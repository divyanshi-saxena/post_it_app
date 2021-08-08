const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    default: 'https://newevolutiondesigns.com/images/freebies/colorful-facebook-cover-2.jpg'
  },
  description: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }
}, {
  timestamps: true
})

const Post = mongoose.model('post', PostSchema)
module.exports = Post