const express = require('express');
const user_route = express();
const session = require('express-session');

// for session 
const config = require('../config/config');
user_route.use(session({secret:config.sessionSecret}));

// for auth
const auth = require('../middleware/auth');

// for view
user_route.set('view engine','ejs');
user_route.set('views','./views/users');

// for get data  from body
const bodyParser = require('body-parser');
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({extended:true}))

// for image upload
const multer = require("multer");
const path = require('path');

user_route.use(express.static('public'));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null,path.join(__dirname, '../public/userimages'))
    },
    filename:function (req, file, cb) {
        const name = Date.now()+'-'+file.originalname;
        cb(null,name);
    }
})
const upload = multer({storage:storage});





// controller for all function
const userController = require('../controllers/userController');


user_route.get('/register',auth.isLogout,userController.loadRegister);
user_route.post('/register',upload.single('image'),userController.insertUser);

user_route.get('/verify',userController.verifymail);
user_route.get('/loginverify',userController.verifyLogin);

user_route.get('/',auth.isLogout, userController.loginload);
user_route.get('/login',auth.isLogout, userController.loginload);
user_route.post('/login',userController.verifyLogin);

user_route.get('/home',auth.isLogin, userController.loadHome);

user_route.get('/logout',auth.isLogin,userController.userlogout);

user_route.get('/forget',auth.isLogout,userController.forgetLoad);

user_route.post('/forget',userController.fogetVerify);

user_route.get('/forget-password',auth.isLogout,userController.fogetPasswordLoad);
user_route.post('/forget-password',userController.resetPassword);

user_route.get('/verification',userController.verificationLoad);
user_route.post('/verification',userController.sentverificationLink);


user_route.get('/edit',auth.isLogin,userController.editLoad);
user_route.post('/edit',upload.single('image'),userController.updateProfile);



module.exports = user_route;