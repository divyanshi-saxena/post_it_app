# post_it_app
This Node JS application lets you to sign up and create posts or stories which can be viewed by fellow users. 
Tech stack: Node JS runtime, Express JS server, EJS server side template, MongoDB Atlas as database. 
Other: AWS S3 for image storage, JWT enabled authentication, MVC design pattern, Video streaming capability, Heroku for deployment.

Application deployed on Heroku: https://post-it-app-div.herokuapp.com/login

Folder structure:
- config
  - awsConfig.js 
    > for boilerplate code for storing image data in AWS S3 through IAM user
  - config.env (.gitignore)
    > for containing confidential information like AWS keys and database URL
  - database.js 
    > for configuring & initializing database - MongoDB Atlas
- controllers
  - authController.js
    > handles user login and subsequent data
  - postController.js
    > handles post related CRUD operations
- middleware
  - auth.js
    > contains middlewares for user authentication and identifying current user
- models
  - Post.js
    > MongoDB schema for Posts with fields: Title, Image and Description
  - User.js
    > MongoDB schema for Users with fields: Name, Email, Password and Avatar
- public
  - logo.png
  - style.css
- routes
  - authRoutes.js
    > contains all routes concerning authentication of user (handled by authController.js)
  - postRoutes.js
    > contains all routes concerning CRUD operations of posts (handled by postController.js)
- views
  - error
    - 404.ejs
    - 500.ejs
  - partials
    - header.ejs
    - footer.ejs
  - posts (contains views for post related CRUD operations)
    - create.ejs
    - edit.ejs
    - showAll.ejs
    - showOne.ejs
  - dashboard.ejs
  - login.ejs
  - register.ejs
- server.js
  > our main file where Express server is initialized
- video.mp4 (for streaming purpose)


For running on localhost, create 'config.env' file inside 'config' folder and initialize below data:
PORT, 
MONGO_URI, 
JWT_SECRET, 
AWS_SECRET, 
AWS_KEY, 
AWS_REGION_ID, 
AWS_BUCKET

Then on terminal, run below command:
> npm install && npm run start

Thanks!
