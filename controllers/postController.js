const Post = require('../models/Post')
const fs = require('fs')
const moment = require('moment')
const { convert } = require('html-to-text')

module.exports.dashboard_page = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user.id }).lean()
    const newPosts = posts.map((post) => {
      let desc = convert(post.description.substring(0, 30), { preserveNewlines: true })
      return { ...post, description: desc}
    })
    res.render('dashboard', {
      name: req.user.name,
      posts: newPosts
    })
  } catch (err) {
    console.log(err)
    res.render('error/500')
  }
}

module.exports.create_post_page = (req, res) => {
  res.render('posts/create')
}

module.exports.create_post = async (req, res) => {
  try {
    req.body.user = req.user.id
    req.body.image = 'https://newevolutiondesigns.com/images/freebies/colorful-facebook-cover-2.jpg'
    if (req.file) {
      req.body.image = req.file.location
    }
    await Post.create(req.body)
    res.status(200).json({
      status: 'success',
      message: 'post created'
    })
  } catch (err) {
    console.log(err)
    res.render('error/500')
  }
}

module.exports.get_all_posts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', { password: 0 })
      .sort({ createdAt: 'desc' })
      .lean()
    const newPosts = posts.map((post) => {
      // let desc = post.description.replace(/<(?:.|\n)*?>/gm, '')

      let desc = convert(post.description.substring(0, 30), { preserveNewlines: true })
      return { ...post, description: desc}
    })
    res.render('posts/showAll', { posts: newPosts })
  } catch (err) {
    console.log(err)
    res.render('error/500')
  }
}

module.exports.get_single_post = async (req, res) => {
  try {
    let post = await Post.findById(req.params.id).populate('user').lean()
    if (!post) {
      return res.render('error/404')
    }
    let newDate = moment(post.createdAt).format('dddd, MMMM Do YYYY, h:mm:ss a')
    let desc = convert(post.description, { preserveNewlines: true })
    newPost = { ...post, description: desc, createdAt: newDate }
    res.render('posts/showOne', { post: newPost })
  } catch (err) {
    console.log(err)
    res.render('error/404')
  }
}

module.exports.edit_post_page = async (req, res) => {
  try {
    const post = await Post.findOne({
    _id: req.params.id
    }).lean()
    if (!post) {
      return res.render('error/404')
    }
    if (post.user != req.user.id) {
      res.redirect('/dashboard')
    } else {
      res.render('posts/edit', {
        post
      })
    }
  } catch (err) {
    console.log(err)
    return res.render('error/500')
  }
}

module.exports.edit_post = async (req, res) => {
  try {
    let params = {...req.body}
    if (req.file) {
      params = {...req.body, image: req.file.location}
    }
    let post = await Post.findById(req.params.id).lean()
    if (!post) {
      return res.render('error/404')
    }
    if (post.user != req.user.id) {
      res.redirect('/dashboard')
    }
    else {
      post = await Post.findOneAndUpdate({ _id: req.params.id }, params, {
        new: true, //creates new story if doesn't exist
        runValidators: true //makes sure if mongoose fields are valid
      })
      res.redirect(`/single_post/${post._id}`)
    }
  } catch (err) {
    console.log(err)
    return res.render('error/500')
  }
}

module.exports.delete_post = async (req, res) => {
  try {
    let post = await Post.findById(req.params.id).lean()
    if (!post) {
      return res.render('error/404')
    }
    if (post.user != req.user.id) {
      res.redirect('/dashboard')
    }
    else {
      await Post.deleteOne({ _id: req.params.id })
      res.redirect('/dashboard')
    }
  } catch (err) {
    console.log(err)
    return res.render('error/500')
  }
}

module.exports.stream_video = (req, res) => {
  const range = req.headers.range
  if (!range) {
    res.status(400).send("Requires Range header")
  }
  
  const videoPath = "video.mp4"
  const videoSize = fs.statSync(videoPath).size

  const CHUNK_SIZE = 10 ** 6
  const start = Number(range.replace(/\D/g, ""))
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1)
  
  // Create headers
  const contentLength = end - start + 1
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4",
  }
    
  // HTTP Status 206 for Partial Content
  res.writeHead(206, headers)
    
  const stream = fs.createReadStream(videoPath, {start, end})
  stream.pipe(res)
}